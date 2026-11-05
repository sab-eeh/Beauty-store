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

  const routineSteps = [
    {
      step: "01",
      title: "Start with skincare",
      description: "Explore cleansers, serums, and moisturizers for your daily routine.",
      category: "skincare",
    },
    {
      step: "02",
      title: "Add your makeup favorites",
      description: "Find the colors and essentials that make your look feel like you.",
      category: "makeup",
    },
    {
      step: "03",
      title: "Finish with a little extra",
      description: "Browse fragrance, haircare, and tools to complete your ritual.",
      category: "fragrance",
    },
  ];

  const shoppingHighlights = [
    {
      title: "Explore by category",
      description: "Go straight to makeup, skincare, fragrance, haircare, or tools.",
      icon: "01",
    },
    {
      title: "Compare the details",
      description: "Check product descriptions, ratings, and review counts before you choose.",
      icon: "02",
    },
    {
      title: "Keep it all together",
      description: "Add your picks to the cart and review everything in one place.",
      icon: "03",
    },
  ];

  const beautyNotes = [
    {
      category: "skincare",
      eyebrow: "SKINCARE",
      title: "Make room for the everyday essentials",
      description: "Browse serums and toners to find a simple starting point for your routine.",
    },
    {
      category: "makeup",
      eyebrow: "MAKEUP",
      title: "Find a look that feels like you",
      description: "Explore color and complexion favorites for everyday looks and special plans.",
    },
    {
      category: "fragrance",
      eyebrow: "FRAGRANCE",
      title: "Discover a new signature scent",
      description: "Explore fragrances, compare the details, and find a scent to suit your style.",
    },
  ];

  const commonQuestions = [
    {
      question: "How do I find products by type?",
      answer: "Use Shop by Category or the category filter on the Products page to narrow your options.",
    },
    {
      question: "Where can I compare product ratings?",
      answer: "Product cards show ratings and review counts. Open a product to see its details and reviews.",
    },
    {
      question: "Can I review my items before checkout?",
      answer: "Yes. Add products to your cart, then open the cart to review quantities and your order summary.",
    },
  ];

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* HERO */}
      <Motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-2xl border bg-gradient-to-br from-white to-brand-50 p-4 shadow-soft sm:p-8"
      >
        <div className="grid gap-5 sm:gap-8 md:grid-cols-2 md:items-center">
          <div>

            <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
              A little beauty, every day
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Makeup & beauty essentials,{" "}
              <span className="text-brand-700">made simple.</span>
            </h1>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex min-h-11 items-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-soft hover:bg-slate-800"
              >
                Shop Now
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-4 shadow-soft sm:p-6">
            <div className="text-sm font-semibold">Today’s picks</div>
            <p className="mt-1 text-xs text-slate-500">
              A few beauty finds to get you started
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

      {/* ROUTINE GUIDE */}
      <section className="space-y-4">
        <SectionHeading
          title="Build your beauty routine"
          subtitle="Explore essentials for every step, at your own pace."
        />

        <div className="grid gap-4 md:grid-cols-3">
          {routineSteps.map((item) => (
            <article
              key={item.step}
              className="flex flex-col rounded-2xl border bg-white p-5 shadow-soft sm:p-6"
            >
              <span className="text-xs font-bold tracking-wider text-brand-700">
                STEP {item.step}
              </span>
              <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
                {item.description}
              </p>
              <Link
                to={`/products?category=${item.category}`}
                className="mt-5 inline-flex min-h-11 items-center self-start rounded-xl border px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Explore collection
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* SHOPPING HIGHLIGHTS */}
      <section className="rounded-3xl bg-slate-900 px-5 py-7 text-white sm:px-8 sm:py-9">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-brand-200">
            A BETTER WAY TO BROWSE
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Your beauty shopping, made simple
          </h2>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {shoppingHighlights.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-white/15 bg-white/5 p-4 sm:p-5"
            >
              <span className="text-xs font-bold tracking-widest text-brand-200">
                {item.icon}
              </span>
              <h3 className="mt-3 font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {item.description}
              </p>
            </article>
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

      {/* BEAUTY NOTES */}
      <section className="space-y-4">
        <SectionHeading
          title="A little inspiration for your routine"
          subtitle="Browse a few collections and find something new to try."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {beautyNotes.map((note) => (
            <article
              key={note.category}
              className="flex min-h-56 flex-col overflow-hidden rounded-2xl border bg-white shadow-soft"
            >
              <div className="h-1.5 bg-gradient-to-r from-brand-300 via-brand-500 to-brand-700" />
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <p className="text-xs font-bold tracking-[0.16em] text-brand-700">
                  {note.eyebrow}
                </p>
                <h3 className="mt-3 text-lg font-semibold leading-6 text-slate-900">
                  {note.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
                  {note.description}
                </p>
                <Link
                  to={`/products?category=${note.category}`}
                  className="mt-4 inline-flex min-h-11 items-center self-start text-sm font-semibold text-slate-900 hover:text-brand-700"
                >
                  Explore {note.eyebrow.toLowerCase()} <span aria-hidden="true" className="ml-1">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SHOPPING GUIDE */}
      <section className="rounded-2xl border bg-slate-50 p-5 sm:p-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold text-brand-700">YOUR BEAUTY, YOUR WAY</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Find the products that fit your routine
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
            Browse by category, compare product details and ratings, then keep
            your favorites together in one convenient cart.
          </p>
          <Link
            to="/products"
            className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-soft hover:bg-brand-700"
          >
            Explore all beauty
          </Link>
        </div>
      </section>

      {/* COMMON QUESTIONS */}
      <section className="grid gap-6 rounded-3xl border bg-white p-5 sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-brand-700">
            NEED A HAND?
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Shopping made clear
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            A few quick answers to help you browse and choose with confidence.
          </p>
          <Link
            to="/products"
            className="mt-5 inline-flex min-h-11 items-center rounded-xl border px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Browse products
          </Link>
        </div>
        <div className="divide-y divide-slate-200">
          {commonQuestions.map((item) => (
            <details key={item.question} className="group py-4 first:pt-0 last:pb-0">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-slate-900 marker:content-none">
                {item.question}
                <span
                  aria-hidden="true"
                  className="shrink-0 text-lg text-brand-700 transition group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-2 pr-7 text-sm leading-6 text-slate-600">
                {item.answer}
              </p>
            </details>
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
