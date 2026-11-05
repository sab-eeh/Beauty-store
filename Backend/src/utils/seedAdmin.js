import User from "../models/User.js";

export async function seedAdmin() {
  const adminEmail = (
    process.env.ADMIN_EMAIL || "admin@beautystore.com"
  ).toLowerCase();
  const adminPass = process.env.ADMIN_PASSWORD || "admin123";

  const exists = await User.findOne({ email: adminEmail });
  if (exists) return;

  const admin = new User({
    name: "Admin",
    email: adminEmail,
    password: adminPass, // uses virtual setter -> passwordHash
    role: "admin",
    isActive: true,
  });

  await admin.save();
  console.log(`✅ Admin seeded: ${adminEmail}`);
}
