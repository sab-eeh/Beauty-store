import { Outlet, NavLink } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import toast from "react-hot-toast";

import useAppStore from "../store/useAppStore";
import useAuthStore from "../store/useAuthStore";

function NavItem({ to, children, right }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative inline-flex items-center gap-2 text-sm font-medium transition ${
          isActive ? "text-brand-700" : "text-slate-700 hover:text-slate-900"
        }`
      }
    >
      <span>{children}</span>
      {right}
    </NavLink>
  );
}

function ProfileMenu({ user, onLogout }) {
  return (
    <div className="relative group">
      <button
        className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
        type="button"
      >
        {user?.name || "Account"}
      </button>

      <div className="invisible absolute right-0 mt-2 w-52 rounded-2xl border bg-white p-2 shadow-soft opacity-0 transition group-hover:visible group-hover:opacity-100">
        <div className="px-3 py-2">
          <div className="text-xs text-slate-500">Signed in as</div>
          <div className="text-sm font-semibold truncate">{user?.email}</div>
        </div>

        <div className="my-2 h-px bg-slate-100" />

        <NavLink
          to="/orders"
          className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          My Orders
        </NavLink>

        {user?.role === "admin" ? (
          <NavLink
            to="/admin"
            className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Admin Panel
          </NavLink>
        ) : null}

        <button
          onClick={onLogout}
          className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-rose-700 hover:bg-rose-50"
          type="button"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default function MainLayout() {
  const items = useAppStore((s) => s.cart.items);
  const cartCount = items.reduce((sum, i) => sum + (i.qty || 0), 0);

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-brand-600 shadow-soft" />
            <div className="leading-tight">
              <div className="text-sm font-semibold">BeautyStore</div>
              <div className="text-xs text-slate-500">Makeup & Skincare</div>
            </div>
          </NavLink>

          <nav className="flex items-center gap-6">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/products">Products</NavItem>

            <NavItem
              to="/cart"
              right={
                cartCount > 0 ? (
                  <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-slate-900 px-1.5 py-0.5 text-[11px] font-bold text-white">
                    {cartCount}
                  </span>
                ) : null
              }
            >
              Cart
            </NavItem>

            {/* Keep Orders visible (route itself is protected) */}
            <NavItem to="/orders">Orders</NavItem>

            {user ? (
              <ProfileMenu
                user={user}
                onLogout={() => {
                  logout();
                  toast.success("Logged out");
                }}
              />
            ) : (
              <div className="flex items-center gap-3">
                <NavItem to="/login">Login</NavItem>
                <NavItem to="/register">Register</NavItem>
              </div>
            )}
          </nav>
        </div>
      </header>

      <Motion.main
        className="container-page py-8"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Outlet />
      </Motion.main>

      <footer className="border-t">
        <div className="container-page py-6 text-xs text-slate-500">
          © {new Date().getFullYear()} BeautyStore 
        </div>
      </footer>
    </div>
  );
}
