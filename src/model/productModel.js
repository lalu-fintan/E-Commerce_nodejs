const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: [
      {
        // type: mongoose.Schema.Types.ObjectId,
        type: String,
        ref: "Category",
      },
    ],
    brand: {
      type: String,
      enum: ["Apple", "Samsung", "Nokia"],
    },
    quantity: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
      // select: false //want to hide te sold in get method
    },
    images: {
      type: Array,
    },
    color: {
      type: Array,
    },
    ratings: [
      {
        star: Number,
        comment: String,
        postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    tottalRating: {
      type: String,
      default: 0,
    },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);
