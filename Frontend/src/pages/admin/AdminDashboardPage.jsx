import { Link } from "react-router-dom";
import { useMemo } from "react";
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

function KpiCard({ label, value, hint, action }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-soft">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-extrabold">{value}</div>
      {hint ? <div className="mt-1 text-xs text-slate-500">{hint}</div> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export default function AdminDashboardPage() {
  const orders = useAppStore((s) => s.orders) || [];

  const {
    productsCount,
    lowStockCount,
    lowStockProducts,
    totalSales,
    latestOrders,
  } = useMemo(() => {
    const products = getAllProducts();
    const productsCount = products.length;

    const lowStockProducts = products
      .filter((p) => (p.stock ?? 0) <= 5)
      .sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0))
      .slice(0, 6);

    const lowStockCount = products.filter((p) => (p.stock ?? 0) <= 5).length;

    const totalSales = orders.reduce(
      (sum, o) => sum + (o?.totals?.total || 0),
      0
    );

    const latestOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6);

    return {
      productsCount,
      lowStockCount,
      lowStockProducts,
      totalSales,
      latestOrders,
    };
  }, [orders]);

  const totalOrders = orders.length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Admin • Dashboard</h2>
          
        </div>

        <div className="flex gap-2">
          <Link
            to="/admin/products"
            className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            Manage Products
          </Link>
          <Link
            to="/admin/orders"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-slate-800"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard
          label="Total Sales"
          value={formatPKR(totalSales)}
          hint="Sum of all orders"
        />
        <KpiCard
          label="Total Orders"
          value={totalOrders}
          hint="Orders placed"
        />
        <KpiCard
          label="Low Stock (≤ 5)"
          value={lowStockCount}
          hint="Items needing restock"
          action={
            <Link
              to="/admin/products"
              className="text-sm font-semibold text-slate-900 hover:underline"
            >
              Review products →
            </Link>
          }
        />
        <KpiCard
          label="Products"
          value={productsCount}
          hint="Total catalog size"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Latest Orders */}
        <div className="rounded-2xl border bg-white p-5 shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Latest Orders</div>
              <div className="mt-1 text-xs text-slate-500">
                Most recent customer purchases
              </div>
            </div>
            <Link
              to="/admin/orders"
              className="text-sm font-semibold text-slate-900 hover:underline"
            >
              View all →
            </Link>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs text-slate-600">
                <tr>
                  <th className="px-3 py-2">Order</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {latestOrders.length === 0 ? (
                  <tr className="border-t">
                    <td className="px-3 py-4 text-slate-600" colSpan={4}>
                      No orders yet.
                    </td>
                  </tr>
                ) : (
                  latestOrders.map((o) => (
                    <tr key={o._id} className="border-t">
                      <td className="px-3 py-3 font-semibold">
                        #{String(o._id).slice(-8)}
                      </td>
                      <td className="px-3 py-3 text-slate-600">
                        {formatDate(o.createdAt)}
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge status={o.status} />
                      </td>
                      <td className="px-3 py-3 text-right font-extrabold">
                        {formatPKR(o?.totals?.total || 0)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock */}
        <div className="rounded-2xl border bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Low Stock</div>
              <div className="mt-1 text-xs text-slate-500">
                Restock these soon
              </div>
            </div>
            <Link
              to="/admin/products"
              className="text-sm font-semibold text-slate-900 hover:underline"
            >
              Open →
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {lowStockProducts.length === 0 ? (
              <div className="text-sm text-slate-600">
                All good — no low stock.
              </div>
            ) : (
              lowStockProducts.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center gap-3 rounded-2xl border p-3"
                >
                  <div className="h-10 w-10 overflow-hidden rounded-xl bg-slate-100">
                    {p.images?.[0] ? (
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">
                      {p.title}
                    </div>
                    <div className="text-xs text-slate-500">{p.brand}</div>
                  </div>
                  <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700">
                    {p.stock}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
