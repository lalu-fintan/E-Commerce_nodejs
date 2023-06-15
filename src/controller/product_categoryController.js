const Category = require("../model/product_categoroyModel");
const asyncHandler = require("express-async-handler");

const createCategory = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const category = await Category.create({ title });
  res.status(200).json({ category });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (category) {
    const update = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      message: "update successfully",
      data: update,
    });
  } else {
    res.status(400).json("category is not avialable");
  }
});

const deletCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (category) {
    const deleted = await Category.findByIdAndRemove(id, req.body);
    res.status(200).json({ message: "category has been deleted" });
  } else {
    res.status(400).json("category is not avialable");
  }
});

const getAllCategories = asyncHandler(async (req, res) => {
  const category = await Category.find();
  res.status(200).json(category);
});

const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (category) {
    res.status(200).json({ category });
  } else {
    res.status(400).json("category is not avialable");
  }
});

module.exports = {
  createCategory,
  updateCategory,
  deletCategory,
  getCategory,
  getAllCategories,
};
