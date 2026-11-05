import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";

export default function CategoryCard({ name, slug, hint }) {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border bg-white p-5 shadow-soft"
    >
      <div className="text-sm font-semibold">{name}</div>
      <div className="mt-1 text-xs text-slate-500">{hint}</div>

      <Link
        to={`/products?category=${encodeURIComponent(slug)}`}
        className="mt-4 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-slate-800"
      >
        Explore
      </Link>
    </Motion.div>
  );
}
