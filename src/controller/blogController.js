const Blog = require("../model/blogModel");
const User = require("../model/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utilities/validateMongoDbId");
const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utilities/cloudinary");
const fs = require("fs");

const createBlog = asyncHandler(async (req, res) => {
  const newBlog = await Blog.create(req.body);

  res.status(200).json({
    status: "Successfull",
    data: newBlog,
  });
});

const getBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.find();
  res.status(200).json(blog);
});

const getBlogById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id).populate("likes").populate("dislikes");
  // populate likes and dislikes of the post in the blog

  if (!blog) {
    throw new Error("No Blog in this Id ");
  }
  await Blog.findByIdAndUpdate(
    id,
    {
      $inc: { numViews: 1 },
    },
    { new: true }
  );
  res.status(200).json(blog);
});

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (!blog) {
    throw new Error("No Blog in this Id");
  }
  const update = await Blog.findByIdAndUpdate(id, req.body, { new: true });
  res.status(200).json(update);
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);

  if (!blog) {
    throw new Error("No Blog in this ID");
  }
  const removeblog = await Blog.findByIdAndRemove(id, req.body);
  res.status(200).json({ message: "blog has been deleted" });
});

const likeBlog = asyncHandler(async (req, res) => {
  const { blogid } = req.body;
  validateMongoDbId(blogid);

  const blog = await Blog.findById(blogid);

  const loginUserId = req.user.id;
  console.log(loginUserId);

  const isLiked = blog.isLiked.id;
  const alreadyDisLiked = blog.dislikes.find(
    (userId) => userId.toString() === loginUserId.toString()
  );
  if (alreadyDisLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogid,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  }
  if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogid,
      {
        $pull: { likes: loginUserId },
        isliked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogid,
      {
        $push: { likes: loginUserId },
        isliked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
});

const disLikeBlog = asyncHandler(async (req, res) => {
  const { blogid } = req.body;
  validateMongoDbId(blogid);

  const blog = await Blog.findById(blogid);

  const loginUserId = req.user.id;
  console.log({ loginUserId });

  const isDisLiked = blog.isDisliked.id;
  const alreadyLiked = blog.likes.find(
    (userId) => userId.toString() === loginUserId.toString()
  );
  if (alreadyLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogid,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  }
  if (isDisLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogid,
      {
        $pull: { dislikes: loginUserId },
        isDisLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogid,
      {
        $push: { dislikes: loginUserId },
        isDisLiked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
});

//bug 5
const uploadImages = asyncHandler(async (req, res) => {
  console.log(req.files);
  const { id } = req.params;
  const Uploader = (path) => {
    cloudinaryUploadImg(path, "images");
  };
  const urls = [];
  const files = req.files;
  for (const file of files) {
    const { path } = file;
    const newPath = await Uploader(path);
    urls.push(newPath);
    fs.unlinkSync(path);
    console.log(newPath);
  }
  const findBlog = await Blog.findByIdAndUpdate(
    id,
    {
      images: urls.map((file) => file),
    },
    { new: true }
  );
  res.status(200).json(findBlog);
});

const deleteImages = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deleted = cloudinaryDeleteImg(id, "images");
  res.status(200).json({ message: "Message deleted successfully" });
});

module.exports = {
  createBlog,
  getBlog,
  getBlogById,
  updateBlog,
  deleteBlog,
  likeBlog,
  disLikeBlog,
  uploadImages,
  deleteImages,
};
