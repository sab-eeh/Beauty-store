import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import useAppStore from "../../store/useAppStore";
import StatusBadge from "../../components/common/StatusBadge";
import { getAllProducts } from "../../api/mockDb";

function formatPKR(value) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString("en-PK", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

const STATUS_FLOW = ["placed", "processing", "shipped", "delivered"];
const EMPTY_ORDERS = [];

export default function AdminOrdersPage() {
  const orders = useAppStore((s) => s.orders) || EMPTY_ORDERS;
  const updateOrderStatus = useAppStore((s) => s.updateOrderStatus);

  const [openId, setOpenId] = useState(null);

  const { totalSales, lowStockCount } = useMemo(() => {
    const totalSales = orders.reduce(
      (sum, o) => sum + (o?.totals?.total || 0),
      0
    );
    const lowStockCount = getAllProducts().filter(
      (p) => (p.stock ?? 0) <= 5
    ).length;
    return { totalSales, lowStockCount };
  }, [orders]);

  const totalOrders = orders.length;

  const setStatus = (orderId, nextStatus) => {
    updateOrderStatus(orderId, nextStatus);
    toast.success(`Order marked as ${nextStatus}`);
  };

  const nextStatus = (current) => {
    const idx = STATUS_FLOW.indexOf(current);
    if (idx === -1) return "processing";
    return STATUS_FLOW[Math.min(idx + 1, STATUS_FLOW.length - 1)];
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold">Admin • Orders</h2>
        
      </div>

      {/* Analytics */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 shadow-soft">
          <div className="text-xs text-slate-500">Total Sales</div>
          <div className="mt-1 text-2xl font-extrabold">
            {formatPKR(totalSales)}
          </div>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-soft">
          <div className="text-xs text-slate-500">Total Orders</div>
          <div className="mt-1 text-2xl font-extrabold">{totalOrders}</div>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-soft">
          <div className="text-xs text-slate-500">Low Stock (≤ 5)</div>
          <div className="mt-1 text-2xl font-extrabold">{lowStockCount}</div>
        </div>
      </div>

      {/* Orders list */}
      {orders.length === 0 ? (
        <div className="rounded-2xl border bg-white p-6 text-sm text-slate-600 shadow-soft">
          No orders yet. Place an order from checkout to see it here.
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => {
            const isOpen = openId === o._id;
            const shortId = String(o._id).slice(-8);

            return (
              <div
                key={o._id}
                className="rounded-2xl border bg-white p-5 shadow-soft"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-semibold">
                        Order #{shortId}
                      </div>
                      <StatusBadge status={o.status} />
                    </div>
                    <div className="text-xs text-slate-500">
                      {formatDate(o.createdAt)} • {o.paymentMethod}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="mr-2 text-right">
                      <div className="text-xs text-slate-500">Total</div>
                      <div className="text-sm font-extrabold">
                        {formatPKR(o?.totals?.total || 0)}
                      </div>
                    </div>

                    <button
                      onClick={() => setOpenId(isOpen ? null : o._id)}
                      className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                    >
                      {isOpen ? "Hide" : "View"}
                    </button>

                    {o.status !== "delivered" && o.status !== "cancelled" ? (
                      <button
                        onClick={() => setStatus(o._id, nextStatus(o.status))}
                        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-slate-800"
                      >
                        Move Next
                      </button>
                    ) : null}

                    {o.status !== "cancelled" ? (
                      <button
                        onClick={() => setStatus(o._id, "cancelled")}
                        className="rounded-xl border px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
                      >
                        Cancel
                      </button>
                    ) : null}
                  </div>
                </div>

                {isOpen && (
                  <div className="mt-4 grid gap-4 lg:grid-cols-3">
                    {/* Items */}
                    <div className="space-y-3 lg:col-span-2">
                      <div className="text-sm font-semibold">Items</div>
                      <div className="space-y-2">
                        {(o.items || []).map((it) => (
                          <div
                            key={`${o._id}_${it.productId}`}
                            className="flex items-center gap-3 rounded-2xl border p-3"
                          >
                            <div className="h-12 w-12 overflow-hidden rounded-xl bg-slate-100">
                              {it.image ? (
                                <img
                                  src={it.image}
                                  alt={it.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : null}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-sm font-semibold">
                                {it.title}
                              </div>
                              <div className="text-xs text-slate-500">
                                {it.qty} × {formatPKR(it.price)}
                              </div>
                            </div>
                            <div className="text-sm font-bold">
                              {formatPKR(it.price * it.qty)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping */}
                    <div className="rounded-2xl border p-4">
                      <div className="text-sm font-semibold">Shipping</div>
                      <div className="mt-3 space-y-1 text-sm text-slate-700">
                        <div className="font-semibold">
                          {o.shipping?.fullName}
                        </div>
                        <div className="text-slate-600">
                          {o.shipping?.phone}
                        </div>
                        {o.shipping?.email ? (
                          <div className="text-slate-600">
                            {o.shipping.email}
                          </div>
                        ) : null}
                        <div className="pt-2 text-slate-600">
                          {o.shipping?.address}
                        </div>
                        <div className="text-slate-600">
                          {o.shipping?.city} {o.shipping?.postalCode}
                        </div>
                      </div>

                      <div className="mt-4 border-t pt-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Subtotal</span>
                          <span className="font-semibold">
                            {formatPKR(o?.totals?.subtotal || 0)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Total</span>
                          <span className="text-base font-extrabold">
                            {formatPKR(o?.totals?.total || 0)}
                          </span>
                        </div>
                      </div>

                      {/* Quick status buttons */}
                      <div className="mt-4">
                        <div className="text-xs font-semibold text-slate-600">
                          Set Status
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {[
                            "placed",
                            "processing",
                            "shipped",
                            "delivered",
                            "cancelled",
                          ].map((st) => (
                            <button
                              key={st}
                              onClick={() => setStatus(o._id, st)}
                              className={`rounded-xl border px-3 py-2 text-xs font-semibold hover:bg-slate-50 ${
                                o.status === st ? "border-slate-900" : ""
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
