import { categories } from "../../api/mockData";

export default function ProductsToolbar({
  search,
  setSearch,
  category,
  setCategory,
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-soft md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products, brands..."
          className="w-full rounded-xl border px-4 py-2 text-sm outline-none focus:border-slate-400"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-slate-400 md:w-56"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={() => {
          setSearch("");
          setCategory("");
        }}
        className="rounded-xl border px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
      >
        Reset
      </button>
    </div>
  );
}
