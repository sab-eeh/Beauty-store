import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuthStore from "../../store/useAuthStore";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);

  const [email, setEmail] = useState("admin@beautystore.com");
  const [password, setPassword] = useState("admin123");

  const submit = (e) => {
    e.preventDefault();
    try {
      const user = login({ email, password });
      if (user.role !== "admin") {
        logout();
        toast.error("This account is not an admin.");
        return;
      }
      toast.success("Admin login successful");
      navigate("/admin", { replace: true });
    } catch (err) {
      toast.error(err.message || "Login failed");
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-brand-50 via-white to-slate-50 px-4 py-10 sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-100/70 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-slate-200/60 blur-3xl"
      />

      <div className="relative w-full max-w-md">
        <Link
          to="/"
          className="mb-5 inline-flex min-h-11 items-center gap-3 rounded-xl px-2 text-sm font-semibold text-slate-700 transition hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold text-white shadow-soft">
            B
          </span>
          <span>BeautyStore</span>
        </Link>

        <section className="rounded-3xl border border-white/80 bg-white/95 p-6 shadow-soft backdrop-blur sm:p-8">
          <div className="mb-7">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
              ADMIN PORTAL
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Welcome back
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Sign in to manage your BeautyStore dashboard.
            </p>
          </div>

          <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Demo administrator account
            </div>
            <div className="mt-2 grid gap-1 text-sm sm:grid-cols-2 sm:gap-3">
              <div className="min-w-0">
                <div className="text-xs text-slate-500">Email</div>
                <div className="break-all font-medium text-slate-800">
                  admin@beautystore.com
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Password</div>
                <div className="font-medium text-slate-800">admin123</div>
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-sm font-semibold text-slate-700"
              >
                Email address
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                placeholder="admin@beautystore.com"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm font-semibold text-slate-700"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="min-h-12 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              Sign in to admin
            </button>
          </form>
        </section>

        <p className="mt-5 text-center text-xs text-slate-500">
          Authorized administrators only
        </p>
      </div>
    </main>
  );
}
