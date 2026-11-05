import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import toast from "react-hot-toast";
import useAppStore from "../../store/useAppStore";

function formatPKR(value) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ProductCard({ product }) {
  const addToCart = useAppStore((s) => s.addToCart);

  const onAdd = () => {
    addToCart({
      productId: product._id,
      title: product.title,
      price: product.price,
      image: product.images?.[0],
      stock: product.stock,
    });
    toast.success("Added to cart");
  };

  return (
    <Motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border bg-white shadow-soft overflow-hidden"
    >
      <Link to={`/products/${product._id}`} className="block">
        <div className="aspect-[4/3] bg-slate-100">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : null}
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              to={`/products/${product._id}`}
              className="line-clamp-1 text-sm font-semibold hover:underline"
            >
              {product.title}
            </Link>
            <div className="mt-1 text-xs text-slate-500">{product.brand}</div>
          </div>

          <div className="text-right">
            <div className="text-sm font-extrabold">
              {formatPKR(product.price)}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              ⭐ {product.rating || 0} ({product.reviewCount || 0})
            </div>
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-slate-600">
          {product.shortDesc || "Premium beauty product for your routine."}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Stock:{" "}
            <span className="font-semibold text-slate-800">
              {product.stock}
            </span>
          </div>

          <button
            onClick={onAdd}
            disabled={product.stock <= 0}
            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-soft hover:bg-slate-800 disabled:opacity-50"
          >
            Add to cart
          </button>
        </div>
      </div>
    </Motion.div>
  );
}
