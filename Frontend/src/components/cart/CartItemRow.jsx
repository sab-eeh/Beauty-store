import toast from "react-hot-toast";
import useAppStore from "../../store/useAppStore";

function formatPKR(value) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function CartItemRow({ item }) {
  const setQty = useAppStore((s) => s.setQty);
  const removeFromCart = useAppStore((s) => s.removeFromCart);

  const inc = () => {
    if (item.qty >= (item.stock ?? 999))
      return toast.error("Stock limit reached");
    setQty(item.productId, item.qty + 1);
  };

  const dec = () => {
    if (item.qty <= 1) return;
    setQty(item.productId, item.qty - 1);
  };

  const onManualQty = (e) => {
    const v = Number(e.target.value || 1);
    setQty(item.productId, v);
  };

  const onRemove = () => {
    removeFromCart(item.productId);
    toast.success("Removed from cart");
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 overflow-hidden rounded-xl bg-slate-100">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>

        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{item.title}</div>
          <div className="mt-1 text-xs text-slate-500">
            {formatPKR(item.price)} • Stock: {item.stock ?? "—"}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
        <div className="flex items-center gap-2">
          <button
            onClick={dec}
            className="h-9 w-9 rounded-xl border text-sm font-bold hover:bg-slate-50"
            aria-label="Decrease quantity"
          >
            −
          </button>

          <input
            type="number"
            min="1"
            value={item.qty}
            onChange={onManualQty}
            className="h-9 w-20 rounded-xl border px-3 text-sm outline-none focus:border-slate-400"
          />

          <button
            onClick={inc}
            className="h-9 w-9 rounded-xl border text-sm font-bold hover:bg-slate-50"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <div className="w-28 text-right text-sm font-bold">
          {formatPKR(item.price * item.qty)}
        </div>

        <button
          onClick={onRemove}
          className="rounded-xl border px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
