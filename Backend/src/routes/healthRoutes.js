import express from "express";

const router = express.Router();

router.get(["/", "/health"], (req, res) => {
  res.json({
    success: true,
    message: "API is healthy ✅",
    time: new Date().toISOString(),
  });
});

export default router;
