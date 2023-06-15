const express = require("express");
const {
  createCategory,
  updateCategory,
  deletCategory,
  getCategory,
  getAllCategories,
} = require("../controller/product_categoryController");
const { verifyToken } = require("../middleware/verifyToken");
const { authMidddleware } = require("../middleware/verifyToken");

const router = express.Router();

router.get("/:id", getCategory);
router.post("/", authMidddleware, verifyToken, createCategory);
router.put("/:id", authMidddleware, verifyToken, updateCategory);
router.get("/", getAllCategories);
router.delete("/:id", authMidddleware, verifyToken, deletCategory);

module.exports = router;
