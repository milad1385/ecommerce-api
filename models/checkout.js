const mongoose = require("mongoose");

const checkoutItemsSchema = new mongoose.Schema({
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

const checkoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [checkoutItemsSchema],
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

    // expiresAt: {
    //   type: Date,
    //   required: true,
    //   default: () => Date.now() * 60 * 60 * 1000, // 1 Hour from creation
    // },
  },
  { timestamps: true }
);

checkoutSchema.virtual("totalPrice").get(function () {
  return this.items.reduce(
    (total, item) =>
      total + (item.price - (item.price * item.discount) / 100) * item.quantity,
    0
  );
});

// checkoutSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Checkout", checkoutSchema);
