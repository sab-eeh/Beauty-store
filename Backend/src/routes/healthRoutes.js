const router = require("express").Router();

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API is healthy ✅",
    time: new Date().toISOString(),
  });
});

module.exports = router;
