import { NavLink, Outlet } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

function SideLink({ to, children }) {
  return (
    <NavLink
      to={to}
      end={to === "/admin"}
      className={({ isActive }) =>
        `block rounded-xl px-4 py-2 text-sm font-semibold transition ${
          isActive
            ? "bg-slate-900 text-white"
            : "text-slate-700 hover:bg-slate-100"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default function AdminLayout() {
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 p-3 sm:gap-6 sm:p-4 md:grid-cols-4">
        <aside className="rounded-2xl border bg-white p-3 shadow-soft sm:p-4 md:col-span-1">
          <div className="mb-4">
            <div className="text-sm font-semibold">Admin Panel</div>
            <div className="text-xs text-slate-500">BeautyStore</div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-1">
            <SideLink to="/admin">Dashboard</SideLink>
            <SideLink to="/admin/products">Products</SideLink>
            <SideLink to="/admin/orders">Orders</SideLink>
          </div>

          <button
            onClick={() => {
              logout();
              window.location.replace("/");
            }}
            className="mt-4 min-h-11 w-full rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-slate-50 md:mt-5"
          >
            Logout
          </button>
        </aside>

        <main className="min-w-0 md:col-span-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
