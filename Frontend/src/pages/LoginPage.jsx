import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuthStore from "../store/useAuthStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const from = location.state?.from || "/";

  const submit = (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error("Email is required");
    if (!password.trim()) return toast.error("Password is required");

    try {
      const user = login({ email, password });
      toast.success(`Welcome back, ${user.name}!`);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || "Login failed");
    }
  };

  return (
    <div className="mx-auto max-w-lg rounded-2xl border bg-white p-6 shadow-soft">
      <h2 className="text-xl font-semibold">Login</h2>
      <p className="mt-1 text-sm text-slate-600">Access your account</p>

      <form onSubmit={submit} className="mt-5 space-y-3">
        <div>
          <label className="text-xs font-semibold text-slate-600">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border px-4 py-2 text-sm outline-none focus:border-slate-400"
            placeholder="you@email.com"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border px-4 py-2 text-sm outline-none focus:border-slate-400"
            placeholder="••••••••"
          />
        </div>

        <button className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-soft hover:bg-slate-800">
          Login
        </button>
      </form>

      <div className="mt-4 text-sm text-slate-600">
        Don’t have an account?{" "}
        <Link
          to="/register"
          className="font-semibold text-slate-900 hover:underline"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
