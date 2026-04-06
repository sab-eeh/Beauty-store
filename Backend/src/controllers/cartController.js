const Cart = require("../models/Cart");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");

function clampQty(qty) {
  const n = Number(qty);
  if (!Number.isFinite(n)) return null;
  const int = Math.floor(n);
  if (int < 1 || int > 99) return null;
  return int;
}

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
}

function mapCartResponse(cartPopulated) {
  const items = (cartPopulated.items || []).map((it) => {
    const p = it.product;
    const price = p?.price ?? 0;
    const qty = it.qty ?? 0;
    return {
      product: p,
      qty,
      lineTotal: price * qty,
    };
  });

  const subtotal = items.reduce((sum, i) => sum + (i.lineTotal || 0), 0);

  return {
    _id: cartPopulated._id,
    user: cartPopulated.user,
    items,
    subtotal,
    itemsCount: items.reduce((sum, i) => sum + (i.qty || 0), 0),
    updatedAt: cartPopulated.updatedAt,
    createdAt: cartPopulated.createdAt,
  };
}

// GET /api/cart
exports.getMyCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);

  const populated = await Cart.findById(cart._id).populate({
    path: "items.product",
    select: "name price images stockQty category slug",
    populate: { path: "category", select: "name slug" },
  });

  res.json({ cart: mapCartResponse(populated) });
});

// POST /api/cart/items  { productId, qty }
exports.addItem = asyncHandler(async (req, res) => {
  const { productId, qty = 1 } = req.body;

  const q = clampQty(qty);
  if (!productId || !q) {
    return res
      .status(400)
      .json({ message: "productId and valid qty (1-99) required" });
  }

  const product = await Product.findById(productId).select("stockQty");
  if (!product) return res.status(404).json({ message: "Product not found" });

  // Optional stock guard (recommended)
  if (typeof product.stockQty === "number" && product.stockQty < q) {
    return res.status(400).json({ message: "Not enough stock" });
  }

  const cart = await getOrCreateCart(req.user._id);

  const idx = cart.items.findIndex(
    (it) => String(it.product) === String(productId)
  );
  if (idx >= 0) {
    const newQty = cart.items[idx].qty + q;

    if (newQty > 99) {
      return res.status(400).json({ message: "Max qty per item is 99" });
    }
    if (typeof product.stockQty === "number" && product.stockQty < newQty) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    cart.items[idx].qty = newQty;
  } else {
    cart.items.push({ product: productId, qty: q });
  }

  await cart.save();

  const populated = await Cart.findById(cart._id).populate({
    path: "items.product",
    select: "name price images stockQty category slug",
    populate: { path: "category", select: "name slug" },
  });

  res.status(201).json({ cart: mapCartResponse(populated) });
});

// PATCH /api/cart/items  { productId, qty }
exports.setItemQty = asyncHandler(async (req, res) => {
  const { productId, qty } = req.body;
  if (!productId)
    return res.status(400).json({ message: "productId required" });

  const n = Number(qty);
  if (!Number.isFinite(n) || n < 0 || n > 99) {
    return res.status(400).json({ message: "qty must be between 0 and 99" });
  }

  const product = await Product.findById(productId).select("stockQty");
  if (!product) return res.status(404).json({ message: "Product not found" });

  const cart = await getOrCreateCart(req.user._id);
  const idx = cart.items.findIndex(
    (it) => String(it.product) === String(productId)
  );
  if (idx < 0) return res.status(404).json({ message: "Item not in cart" });

  // qty=0 means remove
  if (n === 0) {
    cart.items.splice(idx, 1);
  } else {
    if (typeof product.stockQty === "number" && product.stockQty < n) {
      return res.status(400).json({ message: "Not enough stock" });
    }
    cart.items[idx].qty = Math.floor(n);
  }

  await cart.save();

  const populated = await Cart.findById(cart._id).populate({
    path: "items.product",
    select: "name price images stockQty category slug",
    populate: { path: "category", select: "name slug" },
  });

  res.json({ cart: mapCartResponse(populated) });
});

// DELETE /api/cart/items/:productId
exports.removeItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const cart = await getOrCreateCart(req.user._id);

  const before = cart.items.length;
  cart.items = cart.items.filter(
    (it) => String(it.product) !== String(productId)
  );

  if (cart.items.length === before) {
    return res.status(404).json({ message: "Item not in cart" });
  }

  await cart.save();

  const populated = await Cart.findById(cart._id).populate({
    path: "items.product",
    select: "name price images stockQty category slug",
    populate: { path: "category", select: "name slug" },
  });

  res.json({ cart: mapCartResponse(populated) });
});

// DELETE /api/cart
exports.clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = [];
  await cart.save();

  const populated = await Cart.findById(cart._id).populate({
    path: "items.product",
    select: "name price images stockQty category slug",
    populate: { path: "category", select: "name slug" },
  });

  res.json({ cart: mapCartResponse(populated) });
});
