import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuthStore from "../store/useAuthStore";

export default function RegisterPage() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name is required");
    if (!email.trim()) return toast.error("Email is required");
    if (password.trim().length < 6)
      return toast.error("Password must be at least 6 chars");

    try {
      const user = register({ name, email, password });
      toast.success(`Account created: ${user.name}`);
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err.message || "Registration failed");
    }
  };

  return (
    <div className="mx-auto max-w-lg rounded-2xl border bg-white p-6 shadow-soft">
      <h2 className="text-xl font-semibold">Register</h2>
      <p className="mt-1 text-sm text-slate-600">Create your account</p>

      <form onSubmit={submit} className="mt-5 space-y-3">
        <div>
          <label className="text-xs font-semibold text-slate-600">
            Full Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl border px-4 py-2 text-sm outline-none focus:border-slate-400"
            placeholder="Your name"
          />
        </div>

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
            placeholder="Min 6 characters"
          />
        </div>

        <button className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-soft hover:bg-slate-800">
          Create Account
        </button>
      </form>

      <div className="mt-4 text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-slate-900 hover:underline"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
