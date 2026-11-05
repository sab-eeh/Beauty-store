import mongoose from "mongoose";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// If you already have asyncHandler util, use it.
// Otherwise this simple wrapper works:
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

function pickStockField(productDoc) {
  return productDoc && typeof productDoc.stock === "number" ? "stock" : null;
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

function isTransactionUnsupported(err) {
  return (
    err?.code === 20 ||
    /Transaction numbers are only allowed on a replica set member or mongos/i.test(
      err?.message || ""
    )
  );
}

async function createOrderWithoutTransaction({
  userId,
  orderItems,
  shippingAddress,
  paymentMethod,
  subtotal,
  shippingFee,
  total,
  notes,
}) {
  const decrementedStock = [];
  let createdOrder = null;

  try {
    for (const item of orderItems) {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: item.productId, stock: { $gte: item.qty } },
        { $inc: { stock: -item.qty } },
        { new: true }
      );
      if (!updatedProduct) {
        throw new Error(`Not enough stock for: ${item.title}`);
      }
      decrementedStock.push({ productId: item.productId, qty: item.qty });
    }

    createdOrder = await Order.create({
      userId,
      orderItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: "pending",
      status: "placed",
      subtotal,
      shippingFee,
      total,
      notes,
    });

    const clearedCart = await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [] } }
    );
    if (!clearedCart) throw new Error("Cart not found while placing order");

    return createdOrder;
  } catch (err) {
    const rollbackErrors = [];
    if (createdOrder) {
      try {
        const deletion = await Order.deleteOne({ _id: createdOrder._id });
        if (deletion.deletedCount !== 1) {
          throw new Error("Created order could not be removed during rollback");
        }
      } catch (rollbackErr) {
        rollbackErrors.push(rollbackErr);
      }
    }

    if (rollbackErrors.length === 0) {
      for (const item of decrementedStock.reverse()) {
        try {
          const restoration = await Product.updateOne(
            { _id: item.productId },
            { $inc: { stock: item.qty } }
          );
          if (restoration.matchedCount !== 1) {
            throw new Error(`Product ${item.productId} could not be restored`);
          }
        } catch (rollbackErr) {
          rollbackErrors.push(rollbackErr);
        }
      }
    }

    if (rollbackErrors.length) {
      console.error("Order rollback was incomplete:", rollbackErrors);
      throw new AggregateError(
        [err, ...rollbackErrors],
        "Order failed and rollback was incomplete"
      );
    }

    throw err;
  }
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
    "title price images stock"
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
    try {
      await session.withTransaction(async () => {
        for (const item of orderItems) {
          const product = map.get(String(item.productId));
          if (!pickStockField(product)) {
            throw new Error("Product stock field not found (expected stock)");
          }

          const updated = await Product.findOneAndUpdate(
            { _id: item.productId, stock: { $gte: item.qty } },
            { $inc: { stock: -item.qty } },
            { new: true, session }
          );
          if (!updated) {
            throw new Error(`Not enough stock for: ${item.title}`);
          }
        }

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

        const clearedCart = await Cart.findOneAndUpdate(
          { userId: req.user._id },
          { $set: { items: [] } },
          { session }
        );
        if (!clearedCart) throw new Error("Cart not found while placing order");
      });
    } catch (err) {
      if (!isTransactionUnsupported(err)) throw err;

      await session.endSession();
      createdOrder = await createOrderWithoutTransaction({
        userId: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod,
        subtotal,
        shippingFee,
        total,
        notes,
      });
    }

    const orderDoc = createdOrder?.[0] || createdOrder;
    return res.status(201).json({ order: orderDoc });
  } catch (err) {
    if (err.message?.startsWith("Not enough stock for:")) {
      return res.status(400).json({ message: err.message });
    }
    throw err;
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
  if (!isOwner && req.user?.role !== "admin") {
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
