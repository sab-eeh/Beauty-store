import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchProductById } from "../api/productsApi";
import useAppStore from "../store/useAppStore";
import Badge from "../components/common/Badge";
import ReviewsPanel from "../components/products/ReviewsPanel";

function formatPKR(value) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const addToCart = useAppStore((s) => s.addToCart);
  const [refreshKey, setRefreshKey] = useState(0);

  const requestKey = `${id}:${refreshKey}`;
  const [result, setResult] = useState({
    requestKey: null,
    product: null,
  });
  const loading = result.requestKey !== requestKey;
  const p = loading ? null : result.product;
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    let alive = true;

    fetchProductById(id)
      .then((data) => {
        if (alive) setResult({ requestKey, product: data });
      })
      .catch((e) => {
        if (!alive) return;
        toast.error(e.message);
        setResult({ requestKey, product: null });
      })

    return () => {
      alive = false;
    };
  }, [id, requestKey]);

  const outOfStock = (p?.stock ?? 0) <= 0;

  const onAdd = () => {
    if (!p) return;
    if (outOfStock) return toast.error("Out of stock");
    addToCart({
      productId: p._id,
      title: p.title,
      price: p.price,
      image: p.images?.[0],
      stock: p.stock,
    });
    toast.success("Added to cart");
  };

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-96 animate-pulse rounded-2xl bg-slate-100" />
        <div className="space-y-3">
          <div className="h-6 w-2/3 animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-slate-100" />
          <div className="h-10 w-1/2 animate-pulse rounded bg-slate-100" />
          <div className="h-24 w-full animate-pulse rounded bg-slate-100" />
          <div className="h-10 w-full animate-pulse rounded bg-slate-100" />
        </div>
      </div>
    );
  }

  if (!p) {
    return (
      <div className="rounded-2xl border bg-white p-6 shadow-soft">
        <div className="text-sm text-slate-600">Product not found.</div>
        <Link
          to="/products"
          className="mt-3 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Link to="/products" className="text-sm font-semibold text-slate-700">
        ← Back to products
      </Link>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <div className="overflow-hidden rounded-2xl border bg-white shadow-soft">
            <img
              src={p.images?.[activeImg]}
              alt={p.title}
              className="h-[420px] w-full object-cover"
            />
          </div>

          <div className="flex gap-3">
            {p.images?.map((img, idx) => (
              <button
                key={img}
                onClick={() => setActiveImg(idx)}
                className={`overflow-hidden rounded-xl border bg-white ${
                  activeImg === idx ? "border-slate-900" : "border-slate-200"
                }`}
              >
                <img src={img} alt="" className="h-16 w-20 object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {p.featured && <Badge tone="brand">Featured</Badge>}
            {outOfStock && <Badge tone="danger">Out of stock</Badge>}
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-500">
              {p.brand}
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">
              {p.title}
            </h1>
            <div className="mt-2 text-sm text-slate-600">
              ⭐ {p.rating} ({p.reviewCount} reviews)
            </div>
          </div>

          <div className="text-2xl font-extrabold">{formatPKR(p.price)}</div>

          <p className="text-sm text-slate-600">{p.description}</p>

          <div className="text-sm text-slate-600">
            Stock:{" "}
            <span className="font-semibold text-slate-900">{p.stock}</span>
          </div>

          <button
            onClick={onAdd}
            disabled={outOfStock}
            className={`w-full rounded-xl px-4 py-3 text-sm font-semibold shadow-soft transition ${
              outOfStock
                ? "cursor-not-allowed bg-slate-100 text-slate-400"
                : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            Add to Cart
          </button>

          <Link
            to="/cart"
            className="block w-full rounded-xl border px-4 py-3 text-center text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Go to Cart
          </Link>
        </div>
      </div>
      <div className="pt-6">
        <ReviewsPanel
          productId={p._id}
          onStatsUpdated={() => setRefreshKey((k) => k + 1)}
        />
      </div>
    </div>
  );
}
