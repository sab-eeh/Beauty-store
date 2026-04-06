import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProducts } from "../api/productsApi";
import ProductCard from "../components/products/ProductCard";
import ProductsToolbar from "../components/products/ProductsToolbar";
import Page from "../components/common/Page";

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-soft">
      <div className="h-52 w-full animate-pulse bg-slate-100" />
      <div className="p-4">
        <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
        <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-slate-100" />
        <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-slate-100" />
        <div className="mt-3 h-3 w-full animate-pulse rounded bg-slate-100" />
        <div className="mt-2 h-3 w-5/6 animate-pulse rounded bg-slate-100" />
      </div>
      <div className="px-4 pb-4">
        <div className="h-10 w-full animate-pulse rounded-xl bg-slate-100" />
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    fetchProducts({ search, category })
      .then((data) => {
        if (!alive) return;
        setList(data);
      })
      .catch(() => {
        if (!alive) return;
        setList([]);
      })
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [search, category]);

  useEffect(() => {
    const next = {};
    if (search) next.search = search;
    if (category) next.category = category;
    setSearchParams(next, { replace: true });
  }, [search, category, setSearchParams]);

  const countText = useMemo(() => {
    if (loading) return "Loading…";
    return `${list.length} product(s)`;
  }, [loading, list.length]);

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Products</h2>
          <p className="text-sm text-slate-600">
            Browse makeup, skincare, and more
          </p>
        </div>
        <div className="text-sm text-slate-500">{countText}</div>
      </div>

      <ProductsToolbar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : list.map((p) => <ProductCard key={p._id} product={p} />)}
      </div>

      {!loading && list.length === 0 && (
        <div className="rounded-2xl border bg-white p-6 text-sm text-slate-600 shadow-soft">
          No products found. Try a different search or category.
        </div>
      )}
    </div>
  );
}
