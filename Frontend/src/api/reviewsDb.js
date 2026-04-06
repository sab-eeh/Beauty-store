const KEY = "beauty_reviews_v1";

function safeParse(raw, fallback) {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function uid() {
  return `rev_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function getAll() {
  return safeParse(localStorage.getItem(KEY), []);
}

function saveAll(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function getReviewsByProductId(productId) {
  const list = getAll();
  return list
    .filter((r) => r.productId === productId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function addReview({ productId, name, rating, comment }) {
  const list = getAll();

  const review = {
    _id: uid(),
    productId,
    name: name.trim(),
    rating: Number(rating),
    comment: comment.trim(),
    createdAt: new Date().toISOString(),
    status: "approved", // later admin moderation can change
  };

  const next = [review, ...list];
  saveAll(next);
  return review;
}

export function getApprovedReviewsByProductId(productId) {
  return getReviewsByProductId(productId).filter(
    (r) => r.status === "approved"
  );
}

export function computeRatingStats(productId) {
  const approved = getApprovedReviewsByProductId(productId);
  const count = approved.length;
  if (!count) return { avg: 0, count: 0 };

  const sum = approved.reduce((s, r) => s + (r.rating || 0), 0);
  const avg = Number((sum / count).toFixed(1));
  return { avg, count };
}
