import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAppStore from "../store/useAppStore";
import CartItemRow from "../components/cart/CartItemRow";
import Page from "../components/common/Page";

function formatPKR(value) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function CartPage() {
  const navigate = useNavigate();
  const items = useAppStore((s) => s.cart.items);
  const clearCart = useAppStore((s) => s.clearCart);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const onClear = () => {
    if (items.length === 0) return;
    clearCart();
    toast.success("Cart cleared");
  };

  const onCheckout = () => {
    if (items.length === 0) return toast.error("Your cart is empty");
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <Page title="Cart" subtitle="Your shopping cart">
        <div className="rounded-2xl border bg-white p-8 text-center shadow-soft">
          <h2 className="text-xl font-semibold">Your cart is empty</h2>
          <p className="mt-2 text-sm text-slate-600">
            Browse products and add items to your cart.
          </p>
          <Link
            to="/products"
            className="mt-5 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-slate-800"
          >
            Browse Products
          </Link>
        </div>
      </Page>
    );
  }

  return (
    <Page title="Cart" subtitle="Review your items before checkout">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-end justify-between gap-4">
            <div className="text-sm text-slate-600">
              {items.length} item(s) in cart
            </div>

            <button
              onClick={onClear}
              className="rounded-xl border px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Clear cart
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <CartItemRow key={item.productId} item={item} />
            ))}
          </div>
        </div>

        <aside className="h-fit rounded-2xl border bg-white p-5 shadow-soft">
          <div className="text-sm font-semibold">Order Summary</div>

          <div className="mt-4 space-y-2 text-sm">
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

            <div className="border-t pt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Total</span>
                <span className="text-lg font-extrabold">
                  {formatPKR(subtotal)}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onCheckout}
            className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-soft hover:bg-slate-800"
          >
            Continue to Checkout
          </button>

          <Link
            to="/products"
            className="mt-3 block w-full rounded-xl border px-4 py-3 text-center text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Continue Shopping
          </Link>
        </aside>
      </div>
    </Page>
  );
}
