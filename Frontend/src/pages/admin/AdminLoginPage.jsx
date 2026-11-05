import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <div className="mx-auto max-w-lg rounded-2xl border bg-white p-6 shadow-soft">
      <h2 className="text-xl font-semibold">Admin Login</h2>
      <p className="mt-1 text-sm text-slate-600">
        Use default admin credentials (mock):
        <br />
        <span className="font-semibold text-slate-900">
          admin@beautystore.com / admin123
        </span>
      </p>

      <form onSubmit={submit} className="mt-5 space-y-3">
        <div>
          <label className="text-xs font-semibold text-slate-600">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border px-4 py-2 text-sm outline-none focus:border-slate-400"
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
          />
        </div>

        <button className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-soft hover:bg-slate-800">
          Login as Admin
        </button>
      </form>
    </div>
  );
}
