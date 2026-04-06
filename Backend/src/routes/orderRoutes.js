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
router.get("/", protect, admin, adminGetAllOrders);
router.patch("/:id/status", protect, admin, adminUpdateOrderStatus);
router.patch("/:id/payment", protect, admin, adminUpdatePaymentStatus);

export default router;
