const Brand = require("../model/brandModel");
const asyncHandler = require("express-async-handler");

const createBrand = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const brand = await Brand.create({ title });
  res.status(200).json({ brand });
});

const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const brand = await Brand.findById(id);
  if (brand) {
    const update = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      message: "update successfully",
      data: update,
    });
  } else {
    res.status(400).json("brand is not avialable");
  }
});

const deletBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);
  if (brand) {
    const deleted = await Brand.findByIdAndRemove(id, req.body);
    res.status(200).json({ message: "brand has been deleted" });
  } else {
    res.status(400).json("brnad is not avialable");
  }
});

const getAllBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.find();
  res.status(200).json(brand);
});

const getBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);
  if (brand) {
    res.status(200).json({ brand });
  } else {
    res.status(400).json("brand is not avialable");
  }
});

module.exports = {
  createBrand,
  updateBrand,
  deletBrand,
  getBrand,
  getAllBrand,
};
