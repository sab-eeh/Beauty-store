import mongoose from "mongoose";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// If you already have asyncHandler util, use it.
// Otherwise this simple wrapper works:
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

function pickStockField(productDoc) {
  if (productDoc && typeof productDoc.stockQty === "number") return "stockQty";
  if (productDoc && typeof productDoc.countInStock === "number")
    return "countInStock";
  return null;
}

function safeTitle(p) {
  return p?.title || p?.name || "Product";
}

function safeImage(p) {
  if (!p) return "";
  if (typeof p.image === "string") return p.image;
  if (Array.isArray(p.images) && p.images.length) return p.images[0];
  return "";
}

function calcShippingFee(subtotal) {
  // Change this rule however you want:
  // Free shipping above 5000, otherwise 250
  if (subtotal >= 5000) return 0;
  return 250;
}

// POST /api/orders  (create order from cart)
export const createOrderFromCart = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod = "cod", notes = "" } = req.body;

  if (
    !shippingAddress?.fullName ||
    !shippingAddress?.phone ||
    !shippingAddress?.addressLine ||
    !shippingAddress?.city
  ) {
    return res
      .status(400)
      .json({ message: "Missing required shippingAddress fields" });
  }

  if (!["cod", "stripe"].includes(paymentMethod)) {
    return res.status(400).json({ message: "Invalid paymentMethod" });
  }

  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart || !cart.items || cart.items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  // Load latest product data (don’t trust client/cart snapshots for price/stock)
  const productIds = cart.items.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds } }).select(
    "title name price images image stockQty countInStock"
  );
  const map = new Map(products.map((p) => [String(p._id), p]));

  // Build orderItems snapshot
  const orderItems = cart.items.map((ci) => {
    const p = map.get(String(ci.productId));
    if (!p) return null;

    return {
      productId: p._id,
      title: safeTitle(p),
      price: Number(p.price || 0),
      qty: Number(ci.qty || 0),
      image: safeImage(p),
    };
  });

  if (orderItems.some((x) => !x)) {
    return res
      .status(400)
      .json({ message: "One or more products in cart no longer exist" });
  }

  // Basic qty validation
  for (const it of orderItems) {
    if (!it.qty || it.qty < 1) {
      return res.status(400).json({ message: "Invalid quantity in cart" });
    }
    if (!Number.isFinite(it.price) || it.price < 0) {
      return res.status(400).json({ message: "Invalid product price" });
    }
  }

  const subtotal = orderItems.reduce((sum, it) => sum + it.price * it.qty, 0);
  const shippingFee = calcShippingFee(subtotal);
  const total = subtotal + shippingFee;

  // Use transaction if possible
  const session = await mongoose.startSession();
  let createdOrder = null;

  try {
    await session.withTransaction(async () => {
      // 1) Reduce stock atomically for each item
      for (const it of orderItems) {
        const p = map.get(String(it.productId));
        const stockField = pickStockField(p);

        if (!stockField) {
          // If you don’t store stock, you can skip this check.
          // But since you likely do, it’s safer to enforce.
          throw new Error(
            "Product stock field not found (expected stockQty or countInStock)"
          );
        }

        const query = { _id: it.productId, [stockField]: { $gte: it.qty } };
        const update = { $inc: { [stockField]: -it.qty } };

        const updated = await Product.findOneAndUpdate(query, update, {
          new: true,
          session,
        });
        if (!updated) {
          throw new Error(`Not enough stock for: ${it.title}`);
        }
      }

      // 2) Create order
      createdOrder = await Order.create(
        [
          {
            userId: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            paymentStatus: "pending",
            status: "placed",
            subtotal,
            shippingFee,
            total,
            notes,
          },
        ],
        { session }
      );

      // 3) Clear cart
      await Cart.findOneAndUpdate(
        { userId: req.user._id },
        { $set: { items: [] } },
        { session }
      );
    });

    const orderDoc = createdOrder?.[0] || createdOrder;
    return res.status(201).json({ order: orderDoc });
  } catch (err) {
    // If transactions aren't supported, this error could happen depending on Mongo setup
    return res
      .status(400)
      .json({ message: err.message || "Order creation failed" });
  } finally {
    await session.endSession();
  }
});

// GET /api/orders/my
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).sort({
    createdAt: -1,
  });
  res.json({ orders });
});

// GET /api/orders/:id
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  // user can only see own order, admin can see all
  const isOwner = String(order.userId) === String(req.user._id);
  if (!isOwner && !req.user?.isAdmin) {
    return res.status(403).json({ message: "Not allowed" });
  }

  res.json({ order });
});

// ADMIN: GET /api/orders
export const adminGetAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate("userId", "name email") // adjust to your User fields
    .sort({ createdAt: -1 });

  res.json({ orders });
});

// ADMIN: PATCH /api/orders/:id/status
export const adminUpdateOrderStatus = asyncHandler(async (req, res) => {
  const { status, trackingNumber = "" } = req.body;

  const allowed = ["placed", "processing", "shipped", "delivered", "cancelled"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.status = status;

  if (status === "shipped") {
    order.trackingNumber = trackingNumber || order.trackingNumber;
  }

  if (status === "delivered") {
    order.deliveredAt = new Date();
  }

  if (status === "cancelled") {
    order.cancelledAt = new Date();
  }

  await order.save();
  res.json({ order });
});

// ADMIN: PATCH /api/orders/:id/payment
export const adminUpdatePaymentStatus = asyncHandler(async (req, res) => {
  const { paymentStatus } = req.body;

  const allowed = ["pending", "paid", "failed", "refunded"];
  if (!allowed.includes(paymentStatus)) {
    return res.status(400).json({ message: "Invalid paymentStatus" });
  }

  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.paymentStatus = paymentStatus;
  await order.save();

  res.json({ order });
});
