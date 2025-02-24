const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Types.ObjectId,
    ref: "Seller",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    required: true,
    default: 1,
  },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    sellers: {
      type: [sellerSchema],
      default :[],
      required: true,
    },
    images: {
      type: [
        {
          filename: {
            type: String,
            required: true,
            trim: true,
          },
          path: {
            type: String,
            required: true,
            trim: true,
          },
        },
      ],
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },

    subCategory: {
      type: mongoose.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },

    filterValues: {
      type: Map,
      of: mongoose.Types.Mixed,
      required: true,
    },

    customFilters: {
      type: Map,
      of: String,
      required: true,
    },

    shortIdentifier: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
