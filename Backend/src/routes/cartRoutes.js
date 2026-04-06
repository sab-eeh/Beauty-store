const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware"); // adjust name/path to your project

router.use(protect);

router.get("/", cartController.getMyCart);
router.post("/items", cartController.addItem);
router.patch("/items", cartController.setItemQty);
router.delete("/items/:productId", cartController.removeItem);
router.delete("/", cartController.clearCart);

module.exports = router;
