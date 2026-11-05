import express from "express";
import {
  createOrderFromCart,
  getMyOrders,
  getOrderById,
  adminGetAllOrders,
  adminUpdateOrderStatus,
  adminUpdatePaymentStatus,
} from "../controllers/orderController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// User
router.post("/", protect, createOrderFromCart);
router.get("/my", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

// Admin
router.get("/", protect, adminOnly, adminGetAllOrders);
router.patch("/:id/status", protect, adminOnly, adminUpdateOrderStatus);
router.patch("/:id/payment", protect, adminOnly, adminUpdatePaymentStatus);

export default router;
