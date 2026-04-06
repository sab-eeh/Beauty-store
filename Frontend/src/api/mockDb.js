import { products as seedProducts } from "./mockData";

const KEY = "beauty_products_v1";

function safeParse(raw, fallback) {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function uid() {
  return `p_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function ensureProductsSeeded() {
  const existing = safeParse(localStorage.getItem(KEY), null);
  if (Array.isArray(existing) && existing.length) return;

  localStorage.setItem(KEY, JSON.stringify(seedProducts));
}

export function getAllProducts() {
  ensureProductsSeeded();
  return safeParse(localStorage.getItem(KEY), []);
}

export function saveAllProducts(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function findProductById(id) {
  const list = getAllProducts();
  return list.find((p) => p._id === id) || null;
}

export function createProduct(payload) {
  const list = getAllProducts();

  const newProduct = {
    _id: uid(),
    title: payload.title,
    brand: payload.brand || "—",
    category: payload.category,
    price: Number(payload.price) || 0,
    stock: Number(payload.stock) || 0,
    rating: Number(payload.rating) || 0,
    reviewCount: Number(payload.reviewCount) || 0,
    shortDesc: payload.shortDesc || "",
    description: payload.description || "",
    images: Array.isArray(payload.images) ? payload.images : [],
    featured: Boolean(payload.featured),
  };

  const next = [newProduct, ...list];
  saveAllProducts(next);
  return newProduct;
}

export function updateProduct(id, patch) {
  const list = getAllProducts();
  const idx = list.findIndex((p) => p._id === id);
  if (idx === -1) return null;

  const current = list[idx];

  const updated = {
    ...current,
    ...patch,
    price: patch.price !== undefined ? Number(patch.price) : current.price,
    stock: patch.stock !== undefined ? Number(patch.stock) : current.stock,
    rating: patch.rating !== undefined ? Number(patch.rating) : current.rating,
    reviewCount:
      patch.reviewCount !== undefined
        ? Number(patch.reviewCount)
        : current.reviewCount,
    featured:
      patch.featured !== undefined ? Boolean(patch.featured) : current.featured,
    images: patch.images !== undefined ? patch.images : current.images,
  };

  const next = [...list];
  next[idx] = updated;
  saveAllProducts(next);
  return updated;
}

export function deleteProduct(id) {
  const list = getAllProducts();
  const next = list.filter((p) => p._id !== id);
  saveAllProducts(next);
  return next.length !== list.length;
}
