const expressAsyncHandler = require("express-async-handler");
const Product = require("../model/productModel");
const User = require("../model/userModel");
const slugify = require("slugify");
const fs = require("fs");
const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utilities/cloudinary");

const createProduct = expressAsyncHandler(async (req, res) => {
  const {
    title,
    slug,
    description,
    price,
    category,
    brand,
    color,
    quantity,
    tags,
  } = req.body;
  const newProduct = await Product.create({
    title,
    slug: slugify(title),
    description,
    price,
    category,
    brand,
    color,
    quantity,
    tags,
  });
  res.status(200).json({ newProduct });
});

const getProduct = expressAsyncHandler(async (req, res) => {
  //filtering
  const quaryObj = { ...req.query };
  const excludeFields = ["page", "sort", "limit", "field"];
  excludeFields.forEach((el) => delete quaryObj[el]);
  let quaryStr = JSON.stringify(quaryObj);
  quaryStr = quaryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  let query = Product.find(JSON.parse(quaryStr));

  //sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  //limiting the fields
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    query = query.select(fields);
  } else {
    query = query.select("-__v");
  }

  //pagination
  const page = req.query.page;
  const limit = req.query.limit;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  if (req.query.page) {
    const productCount = await Product.countDocuments();
    if (skip >= productCount) {
      throw new Error("This page is doesn't exist");
    }
  }

  const product = await query;
  res.status(200).json(product);
});

const getProductById = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    res.status(400).json({ message: "no Products avilable in this id" });
  }
  res.status(200).json(product);
});

const updateProductById = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    res.status(400).json({ message: "no Products avilable in this id" });
  }
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  const update = await Product.findByIdAndUpdate(id, req.body, { new: true });
  res.status(200).json(update);
});

const deleteProductById = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    res.status(400).json({ message: "no Products avilable in this id" });
  }
  const update = await Product.findByIdAndRemove(id, req.body);
  res.status(200).json({ message: `${product.title} deleted successfully` });
});

const addToWishlist = expressAsyncHandler(async (req, res) => {
  const { id } = req.user;
  console.log(req.user.id);
  const { prodId } = req.body;
  console.log({ prodId });
  const user = await User.findById(id);
  const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId);
  if (alreadyAdded) {
    const user = await User.findByIdAndUpdate(
      id,
      { $pull: { wishlist: prodId } },
      { new: true }
    );
    res.status(200).json(user);
  } else {
    const user = await User.findByIdAndUpdate(
      id,
      { $push: { wishlist: prodId } },
      { new: true }
    );
    res.status(200).json(user);
  }
});

const addRating = expressAsyncHandler(async (req, res) => {
  const { id } = req.user;
  const { star, prodId, comment } = req.body;
  const product = await Product.findById(prodId);
  let alreadyRated = product.ratings.find(
    (userId) => userId.postedby === id.toString()
  );
  console.log(alreadyRated);
  if (alreadyRated) {
    const updateRating = await Product.findOneAndUpdate(
      {
        ratings: { $elemMatch: alreadyRated },
      },
      {
        $set: { "ratings.$.star": star, "ratings.$.comment": comment },
      },
      {
        new: true,
      }
    );
  } else {
    const rateProduct = await Product.findByIdAndUpdate(
      prodId,
      {
        $push: {
          ratings: {
            star: star,
            comment: comment,
            postedBy: prodId,
          },
        },
      },
      { new: true }
    );
  }
  const getAllRatings = await Product.findById(prodId);
  let totalRating = getAllRatings.ratings.length;
  let ratingSum = getAllRatings.ratings
    .map((item) => item.star)
    .reduce((pre, current) => pre + current, 0);
  let actualRating = Math.round(ratingSum / totalRating);
  let finalProduct = await Product.findByIdAndUpdate(
    prodId,
    {
      totalRating: actualRating,
    },
    { new: true }
  );
  res.status(200).json(finalProduct);
});

//bug 6

const uploadImages = expressAsyncHandler(async (req, res) => {
  const uploader = (path) => cloudinaryUploadImg(path, "images");
  const urls = [];
  const files = req.files;
  for (const file of files) {
    const { path } = file;

    const newpath = await uploader(path);
    urls.push(newpath);
    fs.unlinkSync(path);
    console.log({ urls });
  }
  const images = urls.map((file) => {
    return file;
  });
  res.status(200).json(images);
});

const deleteImages = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  const deleted = cloudinaryDeleteImg(id, "images");
  res.status(200).json({ message: "Message deleted successfully" });
});

module.exports = {
  createProduct,
  getProduct,
  getProductById,
  updateProductById,
  deleteProductById,
  addToWishlist,
  addRating,
  uploadImages,
  deleteImages,
};
