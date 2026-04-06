import ProductCard from "./ProductCard";

function CardSkeleton() {
  return (
    <div className="rounded-2xl border bg-white shadow-soft overflow-hidden">
      <div className="aspect-[4/3] bg-slate-100 animate-pulse" />
      <div className="p-4">
        <div className="h-4 w-2/3 rounded bg-slate-100 animate-pulse" />
        <div className="mt-2 h-3 w-1/3 rounded bg-slate-100 animate-pulse" />
        <div className="mt-4 h-3 w-full rounded bg-slate-100 animate-pulse" />
        <div className="mt-2 h-3 w-4/5 rounded bg-slate-100 animate-pulse" />
        <div className="mt-4 flex items-center justify-between">
          <div className="h-3 w-16 rounded bg-slate-100 animate-pulse" />
          <div className="h-8 w-24 rounded-xl bg-slate-100 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function ProductsGrid({ products, loading }) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center shadow-soft">
        <div className="text-sm font-semibold">No products found</div>
        <p className="mt-2 text-sm text-slate-600">
          Try changing filters or search keywords.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}
