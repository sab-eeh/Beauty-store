import User from "../models/User.js";
import { verifyToken } from "../utils/jwt.js";

export async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [type, token] = header.split(" ");

    if (type !== "Bearer" || !token) {
      res.status(401);
      throw new Error("Not authorized, token missing");
    }

    const decoded = verifyToken(token); // { userId, role }
    const user = await User.findById(decoded.userId).select("-passwordHash");

    if (!user || !user.isActive) {
      res.status(401);
      throw new Error("Not authorized, user not found or inactive");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(res.statusCode === 200 ? 401 : res.statusCode);
    next(err);
  }
}

export function adminOnly(req, res, next) {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authorized");
  }
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Admin access required");
  }
  next();
}
