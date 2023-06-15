const express = require("express");
const {
  createBrand,
  updateBrand,
  deletBrand,
  getBrand,
  getAllBrand,
} = require("../controller/brandController");
const { verifyToken } = require("../middleware/verifyToken");
const { authMidddleware } = require("../middleware/verifyToken");

const router = express.Router();

router.get("/:id", getBrand);
router.post("/", authMidddleware, verifyToken, createBrand);
router.put("/:id", authMidddleware, verifyToken, updateBrand);
router.get("/", getAllBrand);
router.delete("/:id", authMidddleware, verifyToken, deletBrand);

module.exports = router;
