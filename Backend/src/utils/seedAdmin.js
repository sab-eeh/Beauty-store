import User from "../models/User.js";

let seedPromise;

export async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPass = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPass) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be configured.");
  }

  if (!seedPromise) {
    seedPromise = (async () => {
      const exists = await User.findOne({ email: adminEmail });
      if (exists) return;

      const admin = new User({
        name: "Admin",
        email: adminEmail,
        password: adminPass,
        role: "admin",
        isActive: true,
      });

      await admin.save();
      console.log(`✅ Admin seeded: ${adminEmail}`);
    })().catch((error) => {
      seedPromise = undefined;
      throw error;
    });
  }

  return seedPromise;
}
