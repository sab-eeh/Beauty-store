import { useMemo, useState } from "react";
import StatusBadge from "../components/common/StatusBadge";
import useAppStore from "../store/useAppStore";

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

export default function OrdersPage() {
  const orders = useAppStore((s) => s.orders) || [];
  const [openId, setOpenId] = useState(null);

  const hasOrders = orders.length > 0;

  const totalOrdersValue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o?.totals?.total || 0), 0);
  }, [orders]);

  if (!hasOrders) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center shadow-soft">
        <h2 className="text-xl font-semibold">My Orders</h2>
        <p className="mt-2 text-sm text-slate-600">
          You have no orders yet. Place an order from checkout to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">My Orders</h2>
        </div>

        <div className="rounded-2xl border bg-white px-4 py-3 text-sm shadow-soft">
          <div className="text-xs text-slate-500">Total spent</div>
          <div className="text-base font-extrabold">
            {formatPKR(totalOrdersValue)}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {orders.map((o) => {
          const shortId = String(o._id).slice(-8);
          const isOpen = openId === o._id;

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

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Total</div>
                    <div className="text-sm font-extrabold">
                      {formatPKR(o?.totals?.total || 0)}
                    </div>
                  </div>

                  <button
                    onClick={() => setOpenId(isOpen ? null : o._id)}
                    className="rounded-xl border px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                  >
                    {isOpen ? "Hide" : "View"}
                  </button>
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
                      <div className="text-slate-600">{o.shipping?.phone}</div>
                      {o.shipping?.email ? (
                        <div className="text-slate-600">{o.shipping.email}</div>
                      ) : null}
                      <div className="pt-2 text-slate-600">
                        {o.shipping?.address}
                      </div>
                      <div className="text-slate-600">
                        {o.shipping?.city} {o.shipping?.postalCode}
                      </div>
                    </div>

                    <div className="mt-4 border-t pt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Subtotal</span>
                        <span className="font-semibold">
                          {formatPKR(o?.totals?.subtotal || 0)}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-sm">
                        <span className="text-slate-600">Total</span>
                        <span className="text-base font-extrabold">
                          {formatPKR(o?.totals?.total || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
