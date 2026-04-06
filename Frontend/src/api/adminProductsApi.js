import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./mockDb";
import { computeRatingStats } from "./reviewsDb";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function adminListProducts() {
  await sleep(200);
  return getAllProducts();
}

export async function adminCreateProduct(payload) {
  await sleep(200);
  return createProduct(payload);
}

export async function adminUpdateProduct(id, patch) {
  await sleep(200);
  const updated = updateProduct(id, patch);
  if (!updated) throw new Error("Product not found");
  return updated;
}

export async function adminDeleteProduct(id) {
  await sleep(150);
  const ok = deleteProduct(id);
  if (!ok) throw new Error("Product not found");
  return true;
}

export async function syncProductRatingFromReviews(productId) {
  // No sleep needed; small operation
  const { avg, count } = computeRatingStats(productId);
  const updated = updateProduct(productId, { rating: avg, reviewCount: count });
  return updated;
}
