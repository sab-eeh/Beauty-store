import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { categories } from "../../api/mockData";
import {
  adminCreateProduct,
  adminDeleteProduct,
  adminListProducts,
  adminUpdateProduct,
} from "../../api/adminProductsApi";
import ProductFormModal from "../../components/admin/ProductFormModal";

function formatPKR(value) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function AdminProductsPage() {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState("create"); // create | edit
  const [active, setActive] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const data = await adminListProducts();
      setList(data);
    } catch (e) {
      toast.error(e.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    const c = category.trim().toLowerCase();

    return list.filter((p) => {
      if (c && p.category !== c) return false;
      if (!s) return true;
      const hay = `${p.title} ${p.brand} ${p.shortDesc}`.toLowerCase();
      return hay.includes(s);
    });
  }, [list, search, category]);

  const openCreate = () => {
    setMode("create");
    setActive(null);
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setMode("edit");
    setActive(p);
    setModalOpen(true);
  };

  const onSubmit = async (payload) => {
    if (mode === "create") {
      await adminCreateProduct(payload);
    } else if (mode === "edit" && active?._id) {
      await adminUpdateProduct(active._id, payload);
    }
    await load();
  };

  const onDelete = async (p) => {
    const ok = window.confirm(`Delete "${p.title}"? This cannot be undone.`);
    if (!ok) return;

    try {
      await adminDeleteProduct(p._id);
      toast.success("Deleted");
      await load();
    } catch (e) {
      toast.error(e.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Admin • Products</h2>
          
        </div>

        <button
          onClick={openCreate}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-slate-800"
        >
          + Add Product
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-soft md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, brand..."
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

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border bg-white shadow-soft">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="text-sm font-semibold">
            {loading ? "Loading..." : `${filtered.length} product(s)`}
          </div>
          
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-600">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-3">
                      <div className="h-4 w-52 animate-pulse rounded bg-slate-100" />
                      <div className="mt-2 h-3 w-32 animate-pulse rounded bg-slate-100" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-20 animate-pulse rounded bg-slate-100" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-10 animate-pulse rounded bg-slate-100" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-14 animate-pulse rounded bg-slate-100" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="ml-auto h-9 w-24 animate-pulse rounded bg-slate-100" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr className="border-t">
                  <td className="px-4 py-6 text-slate-600" colSpan={6}>
                    No products found.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p._id} className="border-t">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-xl bg-slate-100">
                          {p.images?.[0] ? (
                            <img
                              src={p.images[0]}
                              alt={p.title}
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate font-semibold">
                            {p.title}
                          </div>
                          <div className="text-xs text-slate-500">
                            {p.brand}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-slate-700">{p.category}</td>
                    <td className="px-4 py-3 font-semibold">
                      {formatPKR(p.price)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          p.stock <= 5
                            ? "bg-rose-100 text-rose-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">{p.featured ? "Yes" : "No"}</td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="rounded-xl border px-3 py-2 text-xs font-semibold hover:bg-slate-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(p)}
                          className="rounded-xl border px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductFormModal
        open={modalOpen}
        mode={mode}
        initialProduct={active}
        onClose={() => setModalOpen(false)}
        onSubmit={onSubmit}
      />
    </div>
  );
}
