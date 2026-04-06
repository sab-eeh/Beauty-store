const USERS_KEY = "beauty_users_v1";

function safeParse(raw, fallback) {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function uid() {
  return `u_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function getUsers() {
  return safeParse(localStorage.getItem(USERS_KEY), []);
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function seedAdminIfMissing() {
  const users = getUsers();
  const hasAdmin = users.some((u) => u.role === "admin");
  if (hasAdmin) return;

  // ✅ Default admin (change later in backend)
  const admin = {
    _id: uid(),
    name: "Admin",
    email: "admin@beautystore.com",
    password: "admin123",
    role: "admin",
    createdAt: new Date().toISOString(),
  };

  saveUsers([admin, ...users]);
}

export function registerUser({ name, email, password }) {
  seedAdminIfMissing();
  const users = getUsers();

  const cleanEmail = email.trim().toLowerCase();
  const exists = users.some((u) => u.email === cleanEmail);
  if (exists) throw new Error("Email already registered.");

  const user = {
    _id: uid(),
    name: name.trim(),
    email: cleanEmail,
    password, // (mock) plain text; backend will hash
    role: "user",
    createdAt: new Date().toISOString(),
  };

  const next = [user, ...users];
  saveUsers(next);

  return { _id: user._id, name: user.name, email: user.email, role: user.role };
}

export function loginUser({ email, password }) {
  seedAdminIfMissing();
  const users = getUsers();

  const cleanEmail = email.trim().toLowerCase();
  const found = users.find((u) => u.email === cleanEmail);

  if (!found) throw new Error("Account not found.");
  if (found.password !== password) throw new Error("Invalid password.");

  return {
    _id: found._id,
    name: found.name,
    email: found.email,
    role: found.role,
  };
}
