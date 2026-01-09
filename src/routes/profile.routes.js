const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

router.get("profile", authMiddleware, (req, res) => {
  res.json({
    message: "protected data",
    user: req.user,
  });
});

module.exports = router;
