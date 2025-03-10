const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "answer"],
      default: "pending",
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactUs", schema);
