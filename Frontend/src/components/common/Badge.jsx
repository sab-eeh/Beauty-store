export default function Badge({ children, tone = "default" }) {
  const tones = {
    default: "bg-slate-100 text-slate-700",
    danger: "bg-rose-100 text-rose-700",
    success: "bg-emerald-100 text-emerald-700",
    brand: "bg-brand-100 text-brand-800",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
        tones[tone] || tones.default
      }`}
    >
      {children}
    </span>
  );
}
