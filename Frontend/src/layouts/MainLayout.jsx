import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import toast from "react-hot-toast";

import useAppStore from "../store/useAppStore";
import useAuthStore from "../store/useAuthStore";

function NavItem({ to, children, right, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `relative inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium transition lg:min-h-0 lg:rounded-none lg:px-0 ${
          isActive ? "text-brand-700" : "text-slate-700 hover:text-slate-900"
        }`
      }
    >
      <span>{children}</span>
      {right}
    </NavLink>
  );
}

function ProfileMenu({ user, onLogout, onNavigate }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="min-h-11 w-full rounded-xl border bg-white px-3 py-2 text-left text-sm font-semibold text-slate-800 hover:bg-slate-50 lg:w-auto"
        type="button"
      >
        {user?.name || "Account"}
      </button>

      {open && (
        <div className="static z-30 mt-1 w-full rounded-2xl border bg-white p-2 shadow-soft lg:absolute lg:right-0 lg:mt-2 lg:w-52">
          <div className="px-3 py-2">
            <div className="text-xs text-slate-500">Signed in as</div>
            <div className="truncate text-sm font-semibold">{user?.email}</div>
          </div>

          <div className="my-2 h-px bg-slate-100" />

          <NavLink
            to="/orders"
            onClick={() => {
              setOpen(false);
              onNavigate();
            }}
            className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            My Orders
          </NavLink>

          <button
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="mt-1 min-h-11 w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-rose-700 hover:bg-rose-50"
            type="button"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const items = useAppStore((s) => s.cart.items);
  const cartCount = items.reduce((sum, i) => sum + (i.qty || 0), 0);

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
        <div className="container-page flex min-h-16 flex-wrap items-center justify-between gap-y-3 py-3 lg:flex-nowrap lg:py-0">
          <NavLink
            to="/"
            className="flex min-w-0 items-center gap-3"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="h-9 w-9 rounded-xl bg-brand-600 shadow-soft" />
            <div className="leading-tight">
              <div className="text-sm font-semibold">BeautyStore</div>
              <div className="text-xs text-slate-500">Makeup & Skincare</div>
            </div>
          </NavLink>

          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border px-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 lg:hidden"
            aria-expanded={mobileMenuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? "Close" : "Menu"}
          </button>

          <nav
            id="primary-navigation"
            className={`${
              mobileMenuOpen ? "flex" : "hidden"
            } w-full flex-col items-stretch gap-1 border-t pt-3 lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-6 lg:border-0 lg:pt-0`}
          >
            <NavItem to="/" onClick={() => setMobileMenuOpen(false)}>Home</NavItem>
            <NavItem to="/products" onClick={() => setMobileMenuOpen(false)}>Products</NavItem>

            <NavItem
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              right={
                cartCount > 0 ? (
                  <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-slate-900 px-1.5 py-0.5 text-[11px] font-bold text-white">
                    {cartCount}
                  </span>
                ) : null
              }
            >
              Cart
            </NavItem>

            <NavItem to="/orders" onClick={() => setMobileMenuOpen(false)}>Orders</NavItem>
            <NavItem to="/admin/login" onClick={() => setMobileMenuOpen(false)}>Admin Panel</NavItem>

            {user ? (
              <ProfileMenu
                user={user}
                onNavigate={() => setMobileMenuOpen(false)}
                onLogout={() => {
                  logout();
                  toast.success("Logged out");
                  setMobileMenuOpen(false);
                }}
              />
            ) : (
              <NavItem to="/login" onClick={() => setMobileMenuOpen(false)}>Login</NavItem>
            )}
          </nav>
        </div>
      </header>

      <Motion.main
        className="container-page py-5 sm:py-8"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Outlet />
      </Motion.main>

      <footer className="mt-8 border-t bg-slate-50">
        <div className="container-page grid gap-8 py-8 sm:grid-cols-2 sm:py-10 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-2">
            <NavLink to="/" className="inline-flex items-center gap-3">
              <span className="h-9 w-9 rounded-xl bg-brand-600 shadow-soft" />
              <span className="text-base font-bold text-slate-900">
                BeautyStore
              </span>
            </NavLink>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
              Discover makeup, skincare, and everyday beauty essentials to make
              your routine feel like your own.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-900">Shop</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><NavLink className="hover:text-slate-900" to="/products">All products</NavLink></li>
              <li><NavLink className="hover:text-slate-900" to="/products?category=makeup">Makeup</NavLink></li>
              <li><NavLink className="hover:text-slate-900" to="/products?category=skincare">Skincare</NavLink></li>
              <li><NavLink className="hover:text-slate-900" to="/products?category=haircare">Haircare</NavLink></li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-900">Your account</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><NavLink className="hover:text-slate-900" to="/login">Sign in</NavLink></li>
              <li><NavLink className="hover:text-slate-900" to="/orders">Orders</NavLink></li>
              <li><NavLink className="hover:text-slate-900" to="/admin/login">Admin Panel</NavLink></li>
            </ul>
          </div>
        </div>

        <div className="border-t">
          <div className="container-page flex flex-col gap-2 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} BeautyStore. All rights reserved.</span>
            <span>Made for your everyday beauty routine.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
