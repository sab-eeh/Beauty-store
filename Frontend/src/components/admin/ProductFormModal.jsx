import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Modal from "../common/Modal";
import { categories } from "../../api/mockData";

const emptyForm = {
  title: "",
  brand: "",
  category: "",
  price: 0,
  stock: 0,
  shortDesc: "",
  description: "",
  imagesText: "",
  featured: false,
  rating: 0,
  reviewCount: 0,
};

function toImages(imagesText) {
  return imagesText
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function ProductFormModal({
  open,
  mode, // "create" | "edit"
  initialProduct,
  onClose,
  onSubmit, // async (payload) => void
}) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialProduct) {
      setForm({
        title: initialProduct.title || "",
        brand: initialProduct.brand || "",
        category: initialProduct.category || "",
        price: initialProduct.price ?? 0,
        stock: initialProduct.stock ?? 0,
        shortDesc: initialProduct.shortDesc || "",
        description: initialProduct.description || "",
        imagesText: (initialProduct.images || []).join(", "),
        featured: Boolean(initialProduct.featured),
        rating: initialProduct.rating ?? 0,
        reviewCount: initialProduct.reviewCount ?? 0,
      });
    } else {
      setForm(emptyForm);
    }
  }, [open, mode, initialProduct]);

  const previewImg = useMemo(() => {
    const imgs = toImages(form.imagesText);
    return imgs[0] || "";
  }, [form.imagesText]);

  const set = (k) => (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((p) => ({ ...p, [k]: v }));
  };

  const validate = () => {
    if (!form.title.trim()) return "Title is required.";
    if (!form.category.trim()) return "Category is required.";
    if (Number(form.price) <= 0) return "Price must be greater than 0.";
    if (Number(form.stock) < 0) return "Stock cannot be negative.";

    const imgs = toImages(form.imagesText);
    if (imgs.length === 0) return "At least one image URL is required.";

    return null;
  };

  const submit = async () => {
    const err = validate();
    if (err) return toast.error(err);

    const payload = {
      title: form.title.trim(),
      brand: form.brand.trim() || "—",
      category: form.category.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      shortDesc: form.shortDesc.trim(),
      description: form.description.trim(),
      images: toImages(form.imagesText),
      featured: Boolean(form.featured),
      rating: Number(form.rating) || 0,
      reviewCount: Number(form.reviewCount) || 0,
    };

    try {
      setSaving(true);
      await onSubmit(payload);
      toast.success(mode === "edit" ? "Product updated" : "Product created");
      onClose();
    } catch (e) {
      toast.error(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      title={mode === "edit" ? "Edit Product" : "Add Product"}
      onClose={() => !saving && onClose()}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-600">
            Title *
          </label>
          <input
            value={form.title}
            onChange={set("title")}
            className="mt-1 w-full rounded-xl border px-4 py-2 text-sm outline-none focus:border-slate-400"
            placeholder="e.g., Velvet Matte Lipstick"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600">Brand</label>
          <input
            value={form.brand}
            onChange={set("brand")}
            className="mt-1 w-full rounded-xl border px-4 py-2 text-sm outline-none focus:border-slate-400"
            placeholder="e.g., GlowMuse"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600">
            Category *
          </label>
          <select
            value={form.category}
            onChange={set("category")}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-slate-400"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c._id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600">
            Price (PKR) *
          </label>
          <input
            type="number"
            value={form.price}
            onChange={set("price")}
            className="mt-1 w-full rounded-xl border px-4 py-2 text-sm outline-none focus:border-slate-400"
            min="0"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600">
            Stock *
          </label>
          <input
            type="number"
            value={form.stock}
            onChange={set("stock")}
            className="mt-1 w-full rounded-xl border px-4 py-2 text-sm outline-none focus:border-slate-400"
            min="0"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-600">
            Images (comma separated URLs) *
          </label>
          <input
            value={form.imagesText}
            onChange={set("imagesText")}
            className="mt-1 w-full rounded-xl border px-4 py-2 text-sm outline-none focus:border-slate-400"
            placeholder="https://... , https://..."
          />

          {previewImg ? (
            <div className="mt-3 overflow-hidden rounded-2xl border bg-slate-50">
              <img
                src={previewImg}
                alt="Preview"
                className="h-40 w-full object-cover"
              />
            </div>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-600">
            Short Description
          </label>
          <input
            value={form.shortDesc}
            onChange={set("shortDesc")}
            className="mt-1 w-full rounded-xl border px-4 py-2 text-sm outline-none focus:border-slate-400"
            placeholder="1-line summary for product card"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-600">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={set("description")}
            rows={4}
            className="mt-1 w-full rounded-xl border px-4 py-2 text-sm outline-none focus:border-slate-400"
            placeholder="Full product details..."
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600">Rating</label>
          <input
            type="number"
            value={form.rating}
            onChange={set("rating")}
            className="mt-1 w-full rounded-xl border px-4 py-2 text-sm outline-none focus:border-slate-400"
            min="0"
            max="5"
            step="0.1"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600">
            Review Count
          </label>
          <input
            type="number"
            value={form.reviewCount}
            onChange={set("reviewCount")}
            className="mt-1 w-full rounded-xl border px-4 py-2 text-sm outline-none focus:border-slate-400"
            min="0"
          />
        </div>

        <label className="sm:col-span-2 mt-1 inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={set("featured")}
            className="h-4 w-4"
          />
          <span className="font-semibold text-slate-700">Featured</span>
        </label>
      </div>

      <div className="mt-5 flex items-center justify-end gap-3">
        <button
          onClick={onClose}
          disabled={saving}
          className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          onClick={submit}
          disabled={saving}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-slate-800 disabled:opacity-60"
        >
          {saving
            ? "Saving..."
            : mode === "edit"
            ? "Save Changes"
            : "Create Product"}
        </button>
      </div>
    </Modal>
  );
}
