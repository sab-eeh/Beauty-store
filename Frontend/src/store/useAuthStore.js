import { create } from "zustand";
import { loginUser, registerUser, seedAdminIfMissing } from "../api/authDb";

const AUTH_KEY = "beauty_auth_v1";

function safeParse(raw, fallback) {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export default create((set, get) => ({
  user: null,
  token: null, // placeholder

  hydrateAuth: () => {
    seedAdminIfMissing();
    const saved = safeParse(localStorage.getItem(AUTH_KEY), null);
    if (saved?.user)
      set({ user: saved.user, token: saved.token || "mock_token" });
  },

  register: ({ name, email, password }) => {
    const user = registerUser({ name, email, password });
    const token = "mock_token";
    set({ user, token });
    localStorage.setItem(AUTH_KEY, JSON.stringify({ user, token }));
    return user;
  },

  login: ({ email, password }) => {
    const user = loginUser({ email, password });
    const token = "mock_token";
    set({ user, token });
    localStorage.setItem(AUTH_KEY, JSON.stringify({ user, token }));
    return user;
  },

  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem(AUTH_KEY);
  },
}));
