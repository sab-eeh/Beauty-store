import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import SectionHeading from "../components/common/SectionHeading";
import CategoryCard from "../components/products/CategoryCard";
import ProductCard from "../components/products/ProductCard";
import { categories, products } from "../api/mockData";

export default function HomePage() {
  const featured = products.filter((p) => p.featured).slice(0, 6);

  // Simple recommendation logic (frontend-only):
  // pick top-rated + in-stock + not all featured
  const recommended = products
    .filter((p) => p.stock > 0)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 6);

  const categoryHints = {
    makeup: "Lipsticks, foundations, palettes",
    skincare: "Serums, toners, moisturizers",
    haircare: "Shampoo, masks, styling",
    fragrance: "EDP, body mists",
    tools: "Sponges, brushes, accessories",
  };

  return (
    <div className="space-y-10">
      {/* HERO */}
      <Motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-2xl border bg-gradient-to-br from-white to-brand-50 p-8 shadow-soft"
      >
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight">
              Makeup & beauty essentials,{" "}
              <span className="text-brand-700">made simple.</span>
            </h1>

            

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-soft hover:bg-slate-800"
              >
                Shop Now
              </Link>

            </div>

          
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-soft">
            <div className="text-sm font-semibold">Today’s picks</div>
            <p className="mt-1 text-xs text-slate-500">
              Featured products preview (mock)
            </p>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {featured.slice(0, 3).map((p) => (
                <Link
                  key={p._id}
                  to={`/products/${p._id}`}
                  className="overflow-hidden rounded-xl border bg-slate-50 hover:bg-slate-100"
                >
                  <img
                    src={p.images?.[0]}
                    alt={p.title}
                    className="h-20 w-full object-cover"
                    loading="lazy"
                  />
                  <div className="p-2">
                    <div className="line-clamp-1 text-xs font-semibold">
                      {p.title}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <Link
              to="/products"
              className="mt-4 inline-flex w-full justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-brand-700"
            >
              Explore All Products
            </Link>
          </div>
        </div>
      </Motion.section>

      {/* CATEGORIES */}
      <section className="space-y-4">
        <SectionHeading
          title="Shop by Category"
          subtitle="Quickly find what you need"
          right={
            <Link
              to="/products"
              className="text-sm font-semibold text-slate-900 hover:underline"
            >
              View all →
            </Link>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((c) => (
            <CategoryCard
              key={c._id}
              name={c.name}
              slug={c.slug}
              hint={categoryHints[c.slug] || "Explore collection"}
            />
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="space-y-4">
        <SectionHeading
          title="Featured Products"
          subtitle="Top picks selected for you"
          right={
            <Link
              to="/products"
              className="text-sm font-semibold text-slate-900 hover:underline"
            >
              Browse →
            </Link>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>

      {/* RECOMMENDED */}
      <section className="space-y-4">
        <SectionHeading
          title="Recommended for you"
          subtitle="Based on rating and availability (mock logic)"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommended.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
