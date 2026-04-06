import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },

    brand: { type: String, trim: true, default: "—" },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, default: 0, min: 0 },

    stock: { type: Number, default: 0, min: 0, index: true },
    sku: { type: String, trim: true, default: "" },

    images: { type: [String], default: [] },

    shortDesc: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },

    tags: { type: [String], default: [], index: true },

    avgRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },

    isFeatured: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

productSchema.index({ slug: 1 }, { unique: true });

// Text search for products
productSchema.index({ title: "text", brand: "text", tags: "text" });

// Common filter index
productSchema.index({ categoryId: 1, isActive: 1 });

const Product = mongoose.model("Product", productSchema);
export default Product;
