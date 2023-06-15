const express = require("express");
const {
  createProduct,
  getProduct,
  getProductById,
  updateProductById,
  deleteProductById,
  addToWishlist,
} = require("../controller/productController");
const { verifyToken, authMidddleware } = require("../middleware/verifyToken");

const router = express.Router();

router.post("/", verifyToken, createProduct);
router.put("/wishlist", authMidddleware, addToWishlist);
router.get("/", getProduct);
router.get("/:id", getProductById);
router.put("/:id", verifyToken, updateProductById);
router.delete("/:id", verifyToken, deleteProductById);

module.exports = router;
