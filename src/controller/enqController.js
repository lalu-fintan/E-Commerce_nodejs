const Enquiry = require("../model/enqModel");
const asyncHandler = require("express-async-handler");

const createEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.create(req.body);
  res.status(200).json({ enquiry });
});

const updateEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const enquiry = await Enquiry.findById(id);
  if (enquiry) {
    const update = await Enquiry.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      message: "update successfully",
      data: update,
    });
  } else {
    res.status(400).json("Enquiry is not avialable");
  }
});

const deletEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const enquiry = await Enquiry.findById(id);
  if (enquiry) {
    const deleted = await Enquiry.findByIdAndRemove(id, req.body);
    res.status(200).json({ message: "Enquiry has been deleted" });
  } else {
    res.status(400).json("Enquiry is not avialable");
  }
});

const getAllEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.find();
  res.status(200).json(enquiry);
});

const getEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const enquiry = await Enquiry.findById(id);
  if (enquiry) {
    res.status(200).json({ enquiry });
  } else {
    res.status(400).json("Enquiry is not avialable");
  }
});

module.exports = {
  createEnquiry,
  updateEnquiry,
  deletEnquiry,
  getEnquiry,
  getAllEnquiry,
};
