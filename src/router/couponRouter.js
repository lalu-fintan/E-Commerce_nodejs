const express = require("express");
const {
  createCoupon,
  getAllCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controller/couponController");
const { authMidddleware, verifyToken } = require("../middleware/verifyToken");

const router = express.Router();

router.post("/", authMidddleware, verifyToken, createCoupon);
router.get("/", authMidddleware, verifyToken, getAllCoupon);
router.put("/:id", authMidddleware, verifyToken, updateCoupon);
router.delete("/:id", authMidddleware, verifyToken, deleteCoupon);

module.exports = router;
