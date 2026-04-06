import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";
import { requiredString, validEmail } from "../utils/validate.js";

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const errors = [];
    const e1 = requiredString(name, "name", 2, 80);
    if (e1) errors.push(e1);
    const e2 = validEmail(email);
    if (e2) errors.push(e2);
    const e3 = requiredString(password, "password", 6, 200);
    if (e3) errors.push(e3);

    if (errors.length) {
      return res
        .status(400)
        .json({ success: false, message: "Validation error", errors });
    }

    const existing = await User.findOne({ email: String(email).toLowerCase() });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Email already registered" });
    }

    const user = new User({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      password: String(password),
      role: "user",
    });

    await user.save();

    const token = signToken({ userId: user._id, role: user.role });

    return res.status(201).json({
      success: true,
      data: { user: user.toJSON(), token },
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const errors = [];
    const e1 = validEmail(email);
    if (e1) errors.push(e1);
    const e2 = requiredString(password, "password", 1, 200);
    if (e2) errors.push(e2);

    if (errors.length) {
      return res
        .status(400)
        .json({ success: false, message: "Validation error", errors });
    }

    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user || !user.isActive) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const ok = await user.comparePassword(String(password));
    if (!ok) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = signToken({ userId: user._id, role: user.role });

    return res.json({
      success: true,
      data: { user: user.toJSON(), token },
    });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res) {
  return res.json({ success: true, data: { user: req.user } });
}
