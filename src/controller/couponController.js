const Coupon = require("../model/coupenModel");
const asyncHandler = require("express-async-handler");

const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(200).json(coupon);
});

const getAllCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.find();
  res.status(200).json(coupon);
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const coupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
  res.status(200).json(coupon);
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const coupon = await Coupon.findByIdAndDelete(id, req.body, { new: true });
  res.status(200).json({ message: "your coupon deleted successfully" });
});

module.exports = { createCoupon, getAllCoupon, updateCoupon, deleteCoupon };
