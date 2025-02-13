const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  postalCode: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    lat: {
      type: Number,
      required: true,
    },
    lan: {
      type: Number,
      required: true,
    },
  },

  address: {
    type: String,
    required: true,
    trim: true,
  },
  cityId: {
    type: Number,
    required: true,
  },
});

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    roles: {
      type: String,
      enum: ["USER", "ADMIN", "SELLER"],
      default: ["USER"],
    },

    addresses: [addressSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
