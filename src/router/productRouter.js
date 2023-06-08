const express = require("express");
const {
  createProduct,
  getProduct,
  getProductById,
  updateProductById,
  deleteProductById,
} = require("../controller/productController");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.post("/", verifyToken, createProduct);
router.get("/", getProduct);
router.get("/:id", getProductById);
router.put("/:id", verifyToken, updateProductById);
router.delete("/:id", verifyToken, deleteProductById);

module.exports = router;
