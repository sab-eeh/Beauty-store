import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

function isValidProductId(productId) {
  return mongoose.Types.ObjectId.isValid(productId);
}

function mapCartResponse(cart) {
  const items = (cart.items || []).map((item) => {
    const product = item.productId;
    const price = product?.price ?? 0;
    const qty = item.qty ?? 0;

    return { product, qty, lineTotal: price * qty };
  });

  return {
    _id: cart._id,
    userId: cart.userId,
    items,
    subtotal: items.reduce((sum, item) => sum + item.lineTotal, 0),
    itemsCount: items.reduce((sum, item) => sum + item.qty, 0),
    updatedAt: cart.updatedAt,
    createdAt: cart.createdAt,
  };
}

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ userId });
  if (!cart) cart = await Cart.create({ userId, items: [] });
  return cart;
}

async function getPopulatedCart(cartId) {
  return Cart.findById(cartId).populate({
    path: "items.productId",
    select: "title price images stock categoryId slug",
  });
}

function invalidCartItem(res) {
  return res
    .status(400)
    .json({ message: "productId and valid qty (1-99) required" });
}

export const getMyCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  const populated = await getPopulatedCart(cart._id);
  res.json({ cart: mapCartResponse(populated) });
});

export const addItem = asyncHandler(async (req, res) => {
  const { productId, qty = 1 } = req.body;
  if (!isValidProductId(productId) || !Number.isInteger(qty) || qty < 1 || qty > 99) {
    return invalidCartItem(res);
  }

  const product = await Product.findById(productId).select("stock");
  if (!product) return res.status(404).json({ message: "Product not found" });

  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.find(
    (entry) => String(entry.productId) === String(productId)
  );
  const nextQty = (item?.qty || 0) + qty;

  if (nextQty > 99) {
    return res.status(400).json({ message: "Max qty per item is 99" });
  }
  if (product.stock < nextQty) {
    return res.status(400).json({ message: "Not enough stock" });
  }

  if (item) item.qty = nextQty;
  else cart.items.push({ productId, qty });

  await cart.save();
  const populated = await getPopulatedCart(cart._id);
  res.status(201).json({ cart: mapCartResponse(populated) });
});

export const setItemQty = asyncHandler(async (req, res) => {
  const { productId, qty } = req.body;
  if (!isValidProductId(productId) || !Number.isInteger(qty) || qty < 0 || qty > 99) {
    return res
      .status(400)
      .json({ message: "productId and qty between 0 and 99 are required" });
  }

  const product = await Product.findById(productId).select("stock");
  if (!product) return res.status(404).json({ message: "Product not found" });

  const cart = await getOrCreateCart(req.user._id);
  const index = cart.items.findIndex(
    (entry) => String(entry.productId) === String(productId)
  );
  if (index < 0) return res.status(404).json({ message: "Item not in cart" });

  if (qty === 0) cart.items.splice(index, 1);
  else {
    if (product.stock < qty) {
      return res.status(400).json({ message: "Not enough stock" });
    }
    cart.items[index].qty = qty;
  }

  await cart.save();
  const populated = await getPopulatedCart(cart._id);
  res.json({ cart: mapCartResponse(populated) });
});

export const removeItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!isValidProductId(productId)) {
    return res.status(400).json({ message: "Invalid productId" });
  }

  const cart = await getOrCreateCart(req.user._id);
  const index = cart.items.findIndex(
    (entry) => String(entry.productId) === String(productId)
  );
  if (index < 0) return res.status(404).json({ message: "Item not in cart" });

  cart.items.splice(index, 1);
  await cart.save();
  const populated = await getPopulatedCart(cart._id);
  res.json({ cart: mapCartResponse(populated) });
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = [];
  await cart.save();
  const populated = await getPopulatedCart(cart._id);
  res.json({ cart: mapCartResponse(populated) });
});
