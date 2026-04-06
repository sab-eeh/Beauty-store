import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { requiredString, requiredNumber, isValidObjectId } from "../utils/validate.js";

function buildPagination(query) {
  const page = Math.max(1, Number(query.page || 1));
  const limit = Math.min(50, Math.max(1, Number(query.limit || 12)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

function buildSort(sort) {
  switch (sort) {
    case "price_asc":
      return { price: 1 };
    case "price_desc":
      return { price: -1 };
    case "rating_desc":
      return { avgRating: -1, reviewCount: -1 };
    case "latest":
    default:
      return { createdAt: -1 };
  }
}

export async function listProducts(req, res, next) {
  try {
    const { search, category, featured, minPrice, maxPrice, active, sort } = req.query;

    const filter = {};

    // Active filter (default = true for public listing)
    if (active === "false") filter.isActive = false;
    else filter.isActive = true;

    // Featured
    if (featured === "true") filter.isFeatured = true;

    // Category filter (expects categoryId)
    if (category) {
      if (!isValidObjectId(category)) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: [{ field: "category", message: "Invalid category id" }],
        });
      }
      filter.categoryId = category;
    }

    // Price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }

    // Text search
    if (search && String(search).trim()) {
      filter.$text = { $search: String(search).trim() };
    }

    const { page, limit, skip } = buildPagination(req.query);
    const sortObj = buildSort(sort);

    const [items, totalItems] = await Promise.all([
      Product.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalItems / limit) || 1;

    res.json({
      success: true,
      data: { items, page, limit, totalItems, totalPages },
    });
  } catch (err) {
    next(err);
  }
}

export async function getProduct(req, res, next) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: [{ field: "id", message: "Invalid product id" }],
      });
    }

    const product = await Product.findById(id).lean();
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    res.json({ success: true, data: { product } });
  } catch (err) {
    next(err);
  }
}

export async function createProduct(req, res, next) {
  try {
    const {
      title,
      slug,
      brand,
      categoryId,
      price,
      compareAtPrice,
      stock,
      sku,
      images,
      shortDesc,
      description,
      tags,
      isFeatured,
      isActive,
    } = req.body;

    const errors = [];
    const e1 = requiredString(title, "title", 2, 140);
    if (e1) errors.push(e1);
    const e2 = requiredString(slug, "slug", 2, 140);
    if (e2) errors.push(e2);

    if (!isValidObjectId(categoryId)) {
      errors.push({ field: "categoryId", message: "Invalid categoryId" });
    }

    const e3 = requiredNumber(price, "price", { min: 0 });
    if (e3) errors.push(e3);

    if (stock !== undefined) {
      const e4 = requiredNumber(stock, "stock", { min: 0 });
      if (e4) errors.push(e4);
    }

    if (errors.length) {
      return res.status(400).json({ success: false, message: "Validation error", errors });
    }

    const cleanSlug = String(slug).trim().toLowerCase();

    const dupe = await Product.findOne({ slug: cleanSlug });
    if (dupe) return res.status(409).json({ success: false, message: "Product slug already exists" });

    const cat = await Category.findById(categoryId);
    if (!cat) return res.status(400).json({ success: false, message: "Category not found" });

    const product = await Product.create({
      title: String(title).trim(),
      slug: cleanSlug,
      brand: String(brand || "").trim(),
      categoryId,
      price: Number(price),
      compareAtPrice: Number(compareAtPrice || 0),
      stock: Number(stock || 0),
      sku: String(sku || "").trim(),
      images: Array.isArray(images) ? images : [],
      shortDesc: String(shortDesc || "").trim(),
      description: String(description || "").trim(),
      tags: Array.isArray(tags) ? tags : [],
      isFeatured: Boolean(isFeatured),
      isActive: isActive === undefined ? true : Boolean(isActive),
    });

    res.status(201).json({ success: true, data: { product } });
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: [{ field: "id", message: "Invalid product id" }],
      });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const payload = req.body || {};

    if (payload.title !== undefined) product.title = String(payload.title).trim();
    if (payload.slug !== undefined) product.slug = String(payload.slug).trim().toLowerCase();
    if (payload.brand !== undefined) product.brand = String(payload.brand).trim();
    if (payload.price !== undefined) product.price = Number(payload.price);
    if (payload.compareAtPrice !== undefined) product.compareAtPrice = Number(payload.compareAtPrice || 0);
    if (payload.stock !== undefined) product.stock = Number(payload.stock);
    if (payload.sku !== undefined) product.sku = String(payload.sku).trim();
    if (payload.images !== undefined) product.images = Array.isArray(payload.images) ? payload.images : [];
    if (payload.shortDesc !== undefined) product.shortDesc = String(payload.shortDesc).trim();
    if (payload.description !== undefined) product.description = String(payload.description).trim();
    if (payload.tags !== undefined) product.tags = Array.isArray(payload.tags) ? payload.tags : [];
    if (payload.isFeatured !== undefined) product.isFeatured = Boolean(payload.isFeatured);
    if (payload.isActive !== undefined) product.isActive = Boolean(payload.isActive);

    if (payload.categoryId !== undefined) {
      if (!isValidObjectId(payload.categoryId)) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: [{ field: "categoryId", message: "Invalid categoryId" }],
        });
      }
      const cat = await Category.findById(payload.categoryId);
      if (!cat) return res.status(400).json({ success: false, message: "Category not found" });
      product.categoryId = payload.categoryId;
    }

    // slug uniqueness if changed
    const dupe = await Product.findOne({ slug: product.slug, _id: { $ne: product._id } });
    if (dupe) return res.status(409).json({ success: false, message: "Product slug already exists" });

    await product.save();

    res.json({ success: true, data: { product: product.toObject() } });
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: [{ field: "id", message: "Invalid product id" }],
      });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    // soft delete
    product.isActive = false;
    await product.save();

    res.json({ success: true, message: "Product disabled (soft deleted)" });
  } catch (err) {
    next(err);
  }
}
