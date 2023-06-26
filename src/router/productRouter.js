const express = require("express");
const {
  createProduct,
  getProduct,
  getProductById,
  updateProductById,
  deleteProductById,
  addToWishlist,
  addRating,
  uploadImages,
  deleteImages,
} = require("../controller/productController");
const { verifyToken, authMidddleware } = require("../middleware/verifyToken");
const { uploadPhoto, productImgResize } = require("../middleware/uploadImages");

const router = express.Router();

router.post("/", verifyToken, createProduct);
router.post(
  "/upload/",
  authMidddleware,
  verifyToken,
  uploadPhoto.array("images", 10),
  // productImgResize,
  uploadImages
);
router.put("/wishlist", authMidddleware, addToWishlist);
router.put("/rating", authMidddleware, addRating);
router.get("/", getProduct);
router.get("/:id", getProductById);
router.put("/:id", verifyToken, updateProductById);
router.delete("/:id", verifyToken, deleteProductById);
router.delete("/delete-image/:id", authMidddleware, verifyToken, deleteImages);

module.exports = router;
