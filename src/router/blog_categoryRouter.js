const express = require("express");
const {
  createCategory,
  updateCategory,
  deletCategory,
  getCategory,
  getAllCategories,
} = require("../controller/blogCategoryController");
const { verifyToken } = require("../middleware/verifyToken");
const { authMidddleware } = require("../middleware/verifyToken");

const router = express.Router();

router.post("/", authMidddleware, verifyToken, createCategory);
router.get("/:id", getCategory);
router.put("/:id", authMidddleware, verifyToken, updateCategory);
router.get("/", getAllCategories);
router.delete("/:id", authMidddleware, verifyToken, deletCategory);

module.exports = router;
