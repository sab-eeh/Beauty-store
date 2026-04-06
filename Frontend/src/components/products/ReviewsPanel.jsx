import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { addReview, getApprovedReviewsByProductId } from "../../api/reviewsDb";
import { syncProductRatingFromReviews } from "../../api/adminProductsApi";

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString("en-PK", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function ReviewsPanel({ productId, onStatsUpdated }) {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  const [name, setName] = useState("Guest User");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const list = getApprovedReviewsByProductId(productId);
      setReviews(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const avg = useMemo(() => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((s, r) => s + (r.rating || 0), 0);
    return Number((sum / reviews.length).toFixed(1));
  }, [reviews]);

  const submit = async () => {
    if (!name.trim()) return toast.error("Name is required");
    if (!comment.trim()) return toast.error("Comment is required");
    if (Number(rating) < 1 || Number(rating) > 5)
      return toast.error("Rating must be 1 to 5");

    addReview({ productId, name, rating, comment });
    setComment("");
    toast.success("Review submitted");

    // Sync product rating in mock DB so ProductCard reflects it
    await syncProductRatingFromReviews(productId);

    await load();
    onStatsUpdated?.(); // let product detail refetch if needed
  };

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">Reviews</div>
          <div className="mt-1 text-xs text-slate-500">
            ⭐ {avg} • {reviews.length} review(s)
          </div>
        </div>
      </div>

      {/* Add review */}
      <div className="mt-4 rounded-2xl border bg-slate-50 p-4">
        <div className="text-xs font-semibold text-slate-700">Add a review</div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-slate-600">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border bg-white px-4 py-2 text-sm outline-none focus:border-slate-400"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600">
              Rating
            </label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} Star{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-600">
              Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-xl border bg-white px-4 py-2 text-sm outline-none focus:border-slate-400"
              placeholder="Share your experience..."
            />
          </div>
        </div>

        <button
          onClick={submit}
          className="mt-3 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-slate-800"
        >
          Submit Review
        </button>
      </div>

      {/* Reviews list */}
      <div className="mt-5 space-y-3">
        {loading ? (
          <div className="text-sm text-slate-600">Loading…</div>
        ) : reviews.length === 0 ? (
          <div className="text-sm text-slate-600">
            No reviews yet. Be the first to review!
          </div>
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="rounded-2xl border p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold">{r.name}</div>
                <div className="text-xs text-slate-500">
                  {formatDate(r.createdAt)}
                </div>
              </div>
              <div className="mt-1 text-sm">{"⭐".repeat(r.rating)}</div>
              <div className="mt-2 text-sm text-slate-700">{r.comment}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
