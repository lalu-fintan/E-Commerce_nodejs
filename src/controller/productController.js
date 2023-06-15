const expressAsyncHandler = require("express-async-handler");
const Product = require("../model/productModel");
const User = require("../model/userModel");
const slugify = require("slugify");
const { query } = require("express");

const createProduct = expressAsyncHandler(async (req, res) => {
  const { title, slug, description, price, category, brand, color, quantity } =
    req.body;
  const newProduct = await Product.create({
    title,
    slug: slugify(title),
    description,
    price,
    category,
    brand,
    color,
    quantity,
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

module.exports = {
  createProduct,
  getProduct,
  getProductById,
  updateProductById,
  deleteProductById,
  addToWishlist,
};
