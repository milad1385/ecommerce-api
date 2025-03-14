const mongoose = require("mongoose");

const ViewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Products",
      required: true,
      index: true,
    },
    ipAddress: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("View", ViewSchema);
