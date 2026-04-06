import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import useAppStore from "../store/useAppStore";

function formatPKR(value) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
}

function uid() {
  return `ord_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export default function CheckoutPage() {
  const navigate = useNavigate();

  const items = useAppStore((s) => s.cart.items);
  const clearCart = useAppStore((s) => s.clearCart);
  const createOrder = useAppStore((s) => s.createOrder);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items]
  );

  const [payment, setPayment] = useState("cod"); // cod | stripe
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "Karachi",
    postalCode: "",
  });

  const onChange = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const validate = () => {
    if (!items.length) return "Your cart is empty.";
    if (!form.fullName.trim()) return "Full name is required.";
    if (!form.phone.trim()) return "Phone is required.";
    if (!form.address.trim()) return "Address is required.";
    if (!form.city.trim()) return "City is required.";
    if (!form.postalCode.trim()) return "Postal code is required.";
    if (!["cod", "stripe"].includes(payment)) return "Invalid payment method.";
    return null;
  };

  const placeOrder = () => {
    const err = validate();
    if (err) return toast.error(err);

    const now = new Date().toISOString();

    const order = {
      _id: uid(),
      status: "placed",
      paymentMethod:
        payment === "cod" ? "Cash on Delivery" : "Stripe (placeholder)",
      totals: {
        subtotal,
        total: subtotal,
        currency: "PKR",
      },
      shipping: { ...form },
      items: items.map((i) => ({
        productId: i.productId,
        title: i.title,
        price: i.price,
        qty: i.qty,
        image: i.image,
      })),
      createdAt: now,
    };

    createOrder(order);
    clearCart();
    toast.success("Order placed successfully!");
    navigate("/orders");
  };

  if (!items.length) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center shadow-soft">
        <h2 className="text-xl font-semibold">Checkout</h2>
        <p className="mt-2 text-sm text-slate-600">
          Your cart is empty. Add items before checkout.
        </p>
        <Link
          to="/products"
          className="mt-5 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-slate-800"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* LEFT: Shipping + Payment */}
      <div className="space-y-6 lg:col-span-2">
        <div>
          <h2 className="text-xl font-semibold">Checkout</h2>
          <p className="text-sm text-slate-600">
            Enter shipping details and select payment method
          </p>
        </div>

        {/* Shipping */}
        <section className="rounded-2xl border bg-white p-5 shadow-soft">
          <div className="text-sm font-semibold">Shipping Details</div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-600">
                Full Name *
              </label>
              <input
                value={form.fullName}
                onChange={onChange("fullName")}
                className="mt-1 w-full rounded-xl border px-4 py-2 text-sm outline-none focus:border-slate-400"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">
                Phone *
              </label>
              <input
                value={form.phone}
                onChange={onChange("phone")}
                className="mt-1 w-full rounded-xl border px-4 py-2 text-sm outline-none focus:border-slate-400"
                placeholder="+92..."
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">
                Email (optional)
              </label>
              <input
                value={form.email}
                onChange={onChange("email")}
                className="mt-1 w-full rounded-xl border px-4 py-2 text-sm outline-none focus:border-slate-400"
                placeholder="you@email.com"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-600">
                Address *
              </label>
              <input
                value={form.address}
                onChange={onChange("address")}
                className="mt-1 w-full rounded-xl border px-4 py-2 text-sm outline-none focus:border-slate-400"
                placeholder="House, street, area"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">
                City *
              </label>
              <input
                value={form.city}
                onChange={onChange("city")}
                className="mt-1 w-full rounded-xl border px-4 py-2 text-sm outline-none focus:border-slate-400"
                placeholder="Karachi"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">
                Postal Code *
              </label>
              <input
                value={form.postalCode}
                onChange={onChange("postalCode")}
                className="mt-1 w-full rounded-xl border px-4 py-2 text-sm outline-none focus:border-slate-400"
                placeholder="xxxxx"
              />
            </div>
          </div>
        </section>

        {/* Payment */}
        <section className="rounded-2xl border bg-white p-5 shadow-soft">
          <div className="text-sm font-semibold">Payment Method</div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setPayment("cod")}
              className={`rounded-2xl border p-4 text-left transition ${
                payment === "cod"
                  ? "border-slate-900 bg-slate-50"
                  : "hover:bg-slate-50"
              }`}
            >
              <div className="text-sm font-semibold">Cash on Delivery</div>
              <div className="mt-1 text-xs text-slate-600">
                Pay when you receive the order.
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPayment("stripe")}
              className={`rounded-2xl border p-4 text-left transition ${
                payment === "stripe"
                  ? "border-slate-900 bg-slate-50"
                  : "hover:bg-slate-50"
              }`}
            >
              <div className="text-sm font-semibold">Stripe</div>
              <div className="mt-1 text-xs text-slate-600">
                Placeholder for card payments (backend later).
              </div>
            </button>
          </div>
        </section>
      </div>

      {/* RIGHT: Summary */}
      <aside className="h-fit rounded-2xl border bg-white p-5 shadow-soft">
        <div className="text-sm font-semibold">Order Summary</div>

        <div className="mt-4 space-y-3">
          {items.map((i) => (
            <div key={i.productId} className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-xl bg-slate-100">
                {i.image ? (
                  <img
                    src={i.image}
                    alt={i.title}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{i.title}</div>
                <div className="text-xs text-slate-500">
                  {i.qty} × {formatPKR(i.price)}
                </div>
              </div>
              <div className="text-sm font-bold">
                {formatPKR(i.price * i.qty)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t pt-4 space-y-2 text-sm">
          <div className="flex items-center justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-900">
              {formatPKR(subtotal)}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-600">
            <span>Shipping</span>
            <span className="font-semibold text-slate-900">Calculated</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Total</span>
            <span className="text-lg font-extrabold">
              {formatPKR(subtotal)}
            </span>
          </div>
        </div>

        <button
          onClick={placeOrder}
          className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-soft hover:bg-slate-800"
        >
          Place Order
        </button>

        <Link
          to="/cart"
          className="mt-3 block w-full rounded-xl border px-4 py-3 text-center text-sm font-semibold text-slate-900 hover:bg-slate-50"
        >
          Back to Cart
        </Link>

        {payment === "stripe" && (
          <div className="mt-4 rounded-2xl border bg-slate-50 p-3 text-xs text-slate-600">
            Stripe is a placeholder for now. We’ll integrate it when backend is
            ready.
          </div>
        )}
      </aside>
    </div>
  );
}
