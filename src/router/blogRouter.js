const express = require("express");
const {
  createBlog,
  getBlog,
  getBlogById,
  updateBlog,
  deleteBlog,
  likeBlog,
  disLikeBlog,
  uploadImages,
  deleteImages,
} = require("../controller/blogController");
const { verifyToken, authMidddleware } = require("../middleware/verifyToken");
const { uploadPhoto, blogImgResize } = require("../middleware/uploadImages");

const router = express.Router();

router.post("/", verifyToken, createBlog);
router.put(
  "/upload/:id",
  authMidddleware,
  verifyToken,
  uploadPhoto.array("images", 2),
  // blogImgResize,
  uploadImages
);
router.get("/", getBlog);
router.get("/:id", authMidddleware, verifyToken, getBlogById);
router.put("/likes", authMidddleware, likeBlog);
router.put("/dislikes", authMidddleware, disLikeBlog);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);
router.delete("/delete-image/:id", authMidddleware, verifyToken, deleteImages);

module.exports = router;
