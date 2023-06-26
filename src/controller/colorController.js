const Color = require("../model/colorModel");
const asyncHandler = require("express-async-handler");

const createColor = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const color = await Color.create({ title });
  res.status(200).json({ color });
});

const updateColor = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const color = await Color.findById(id);
  if (color) {
    const update = await Color.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      message: "update successfully",
      data: update,
    });
  } else {
    res.status(400).json("Color is not avialable");
  }
});

const deletColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const color = await Color.findById(id);
  if (color) {
    const deleted = await Color.findByIdAndRemove(id, req.body);
    res.status(200).json({ message: "Color has been deleted" });
  } else {
    res.status(400).json("Color is not avialable");
  }
});

const getAllColor = asyncHandler(async (req, res) => {
  const color = await Color.find();
  res.status(200).json(color);
});

const getColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const color = await Color.findById(id);
  if (Color) {
    res.status(200).json({ color });
  } else {
    res.status(400).json("Color is not avialable");
  }
});

module.exports = {
  createColor,
  updateColor,
  deletColor,
  getColor,
  getAllColor,
};
