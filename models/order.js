const mongoose = require("mongoose");

const orderItemsSchema = new mongoose.Schema({
  product: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  seller: {
    type: mongoose.Types.ObjectId,
    ref: "Seller",
    required: true,
  },
  quantity: {
    type: Number,
    min: 1,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [orderItemsSchema],
      default: [],
    },

    shipping: {
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
    },

    authority: {
      type: String,
      required: true,
      trim: true,
    },

    postTrackingCode: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["PROCESSING", "SHIPPED", "DELIVERED"],
      default: "PROCESSING",
    },
  },
  { timestamps: true }
);

orderSchema.virtual("totalPrice").get(function () {
  return this.items.reduce(
    (total, item) =>
      total + (item.price - (item.price * item.discount) / 100) * item.quantity,
    0
  );
});

module.exports = mongoose.model("Order", orderSchema);
