const express = require("express");
const {
  createBlog,
  getBlog,
  getBlogById,
  updateBlog,
  deleteBlog,
  likeBlog,
  disLikeBlog,
} = require("../controller/blogController");
const { verifyToken, authMidddleware } = require("../middleware/verifyToken");

const router = express.Router();

router.post("/", verifyToken, createBlog);
router.get("/", getBlog);
router.get("/:id", authMidddleware, verifyToken, getBlogById);
router.put("/likes", authMidddleware, likeBlog);
router.put("/dislikes", authMidddleware, disLikeBlog);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);

module.exports = router;
