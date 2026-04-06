import mongoose from "mongoose";

export function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export function requiredString(value, field, min = 1, max = 200) {
  const v = String(value || "").trim();
  if (!v) return { field, message: `${field} is required` };
  if (v.length < min)
    return { field, message: `${field} must be at least ${min} characters` };
  if (v.length > max)
    return { field, message: `${field} must be at most ${max} characters` };
  return null;
}

export function validEmail(value) {
  const v = String(value || "")
    .trim()
    .toLowerCase();
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  return ok ? null : { field: "email", message: "Invalid email" };
}

export function requiredNumber(
  value,
  field,
  { min = -Infinity, max = Infinity } = {}
) {
  const n = Number(value);
  if (Number.isNaN(n)) return { field, message: `${field} must be a number` };
  if (n < min) return { field, message: `${field} must be >= ${min}` };
  if (n > max) return { field, message: `${field} must be <= ${max}` };
  return null;
}
