import { create } from "zustand";

const useAppStore = create((set, get) => ({
  user: null, // later from auth
  cart: {
    items: [], // { productId, title, price, image, qty, stock }
  },
  orders: [], // local mock orders for frontend-only phase

  // ---------- CART ACTIONS ----------
  addToCart: (item) => {
    const items = get().cart.items;
    const existing = items.find((x) => x.productId === item.productId);

    let nextItems;
    if (existing) {
      nextItems = items.map((x) =>
        x.productId === item.productId
          ? { ...x, qty: Math.min(x.qty + 1, x.stock ?? 999) }
          : x
      );
    } else {
      nextItems = [...items, { ...item, qty: 1 }];
    }

    set({ cart: { items: nextItems } });
    localStorage.setItem("beauty_cart", JSON.stringify(nextItems));
  },

  removeFromCart: (productId) => {
    const nextItems = get().cart.items.filter((x) => x.productId !== productId);
    set({ cart: { items: nextItems } });
    localStorage.setItem("beauty_cart", JSON.stringify(nextItems));
  },

  setQty: (productId, qty) => {
    const items = get().cart.items;
    const nextItems = items.map((x) =>
      x.productId === productId
        ? { ...x, qty: Math.max(1, Math.min(qty, x.stock ?? 999)) }
        : x
    );
    set({ cart: { items: nextItems } });
    localStorage.setItem("beauty_cart", JSON.stringify(nextItems));
  },

  clearCart: () => {
    set({ cart: { items: [] } });
    localStorage.removeItem("beauty_cart");
  },

  hydrateCart: () => {
    try {
      const raw = localStorage.getItem("beauty_cart");
      const items = raw ? JSON.parse(raw) : [];
      set({ cart: { items } });
    } catch {
      // ignore
    }
  },
  hydrateOrders: () => {
    try {
      const raw = localStorage.getItem("beauty_orders");
      const orders = raw ? JSON.parse(raw) : [];
      set({ orders });
    } catch {
      // ignore
    }
  },

  createOrder: (order) => {
    const existing = get().orders || [];
    const next = [order, ...existing];
    set({ orders: next });
    localStorage.setItem("beauty_orders", JSON.stringify(next));
  },
  updateOrderStatus: (orderId, status) => {
    const orders = get().orders || [];
    const next = orders.map((o) => (o._id === orderId ? { ...o, status } : o));
    set({ orders: next });
    localStorage.setItem("beauty_orders", JSON.stringify(next));
  },
}));

export default useAppStore;
