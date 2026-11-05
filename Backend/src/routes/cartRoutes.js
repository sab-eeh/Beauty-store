import express from "express";
import {
  addItem,
  clearCart,
  getMyCart,
  removeItem,
  setItemQty,
} from "../controllers/cartController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getMyCart);
router.post("/items", addItem);
router.patch("/items", setItemQty);
router.delete("/items/:productId", removeItem);
router.delete("/", clearCart);

export default router;
