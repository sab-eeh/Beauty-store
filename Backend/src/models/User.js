import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, default: "Home" }, // Home/Office etc
    fullName: { type: String, trim: true },
    phone: { type: String, trim: true },
    addressLine: { type: String, trim: true },
    city: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, trim: true, default: "Pakistan" },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index: true,
    },
    isActive: { type: Boolean, default: true, index: true },

    addresses: { type: [addressSchema], default: [] },
  },
  { timestamps: true }
);

// Ensure unique index is created
userSchema.index({ email: 1 }, { unique: true });

// Virtual: set password
userSchema.virtual("password").set(function (password) {
  this._password = password;
  this.passwordHash = bcrypt.hashSync(password, 10);
});

// Method: compare password
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

// Remove sensitive fields in JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

const User = mongoose.model("User", userSchema);
export default User;
