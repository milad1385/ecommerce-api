const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },

    status: {
      type: String,
      required: true,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
      trim: true,
    },
    adminComment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SellerRequest", schema);
