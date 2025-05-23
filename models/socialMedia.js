const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    icon: {
      type: {
        filename: { type: String, required: true },
        path: { type: String, required: true },
      },
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    link: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SocialMedia", schema);
