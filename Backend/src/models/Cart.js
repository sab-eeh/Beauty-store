import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    qty: { type: Number, required: true, min: 1 },

    // Optional snapshot fields (good for faster cart display)
    title: { type: String, default: "" },
    price: { type: Number, default: 0 },
    image: { type: String, default: "" },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: { type: [cartItemSchema], default: [] },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
