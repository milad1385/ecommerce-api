const mongoose = require("mongoose");

const cartItemsSchema = new mongoose.Schema({
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

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [cartItemsSchema],
      default: [],
    },
  },
  { timestamps: true }
);

cartSchema.virtual("totalPrice").get(function () {
  return this.items.reduce(
    (total, item) =>
      total + (item.price - (item.price * item.discount) / 100) * item.quantity,
    0
  );
});

cartSchema.pre("save", (next) => {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Cart", cartSchema);
