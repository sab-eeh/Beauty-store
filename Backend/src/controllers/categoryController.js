import Category from "../models/Category.js";
import { requiredString } from "../utils/validate.js";

export async function listCategories(req, res, next) {
  try {
    const active = req.query.active;
    const filter = {};

    if (active === "true") filter.isActive = true;
    if (active === "false") filter.isActive = false;

    const items = await Category.find(filter).sort({ sortOrder: 1, name: 1 });

    res.json({ success: true, data: { items } });
  } catch (err) {
    next(err);
  }
}

export async function createCategory(req, res, next) {
  try {
    const { name, slug, image, sortOrder } = req.body;

    const errors = [];
    const e1 = requiredString(name, "name", 2, 60);
    if (e1) errors.push(e1);
    const e2 = requiredString(slug, "slug", 2, 60);
    if (e2) errors.push(e2);

    if (errors.length) {
      return res
        .status(400)
        .json({ success: false, message: "Validation error", errors });
    }

    const cleanSlug = String(slug).trim().toLowerCase();

    const exists = await Category.findOne({ slug: cleanSlug });
    if (exists) {
      return res
        .status(409)
        .json({ success: false, message: "Category slug already exists" });
    }

    const category = await Category.create({
      name: String(name).trim(),
      slug: cleanSlug,
      image: String(image || "").trim(),
      sortOrder: Number(sortOrder || 0),
      isActive: true,
    });

    res.status(201).json({ success: true, data: { category } });
  } catch (err) {
    next(err);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const { name, slug, image, sortOrder, isActive } = req.body;

    const category = await Category.findById(id);
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });

    if (name !== undefined) category.name = String(name).trim();
    if (slug !== undefined) category.slug = String(slug).trim().toLowerCase();
    if (image !== undefined) category.image = String(image).trim();
    if (sortOrder !== undefined) category.sortOrder = Number(sortOrder || 0);
    if (isActive !== undefined) category.isActive = Boolean(isActive);

    // slug uniqueness check if changed
    const dupe = await Category.findOne({
      slug: category.slug,
      _id: { $ne: category._id },
    });
    if (dupe) {
      return res
        .status(409)
        .json({ success: false, message: "Category slug already exists" });
    }

    await category.save();

    res.json({ success: true, data: { category } });
  } catch (err) {
    next(err);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });

    // soft delete
    category.isActive = false;
    await category.save();

    res.json({ success: true, message: "Category disabled (soft deleted)" });
  } catch (err) {
    next(err);
  }
}
