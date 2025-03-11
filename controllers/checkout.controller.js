const { errorResponse, successResponse } = require("../helpers/responses");
const Cart = require("../models/cart");
const Checkout = require("../models/checkout");
const { createPayment } = require("../services/zarinpal");

exports.createCheckout = async (req, res, next) => {
  try {
    const user = req.user;
    const { shippingAddress } = req.body;

    const cart = await Cart.findOne({ user: user._id }).populate(
      "items.product items.seller"
    );

    if (!cart?.items?.length) {
      return errorResponse(res, 404, "User basket is not found or empty!!!");
    }

    const checkoutItems = [];

    for (const item of cart.items) {
      const { product, seller } = item;

      const sellerDetails = product.sellers.find(
        (sellerInfo) => sellerInfo.seller.toString() === seller._id.toString()
      );

      if (!sellerDetails) {
        return errorResponse(res, 400, "Seller is not found !!!");
      }

      checkoutItems.push({
        product: product._id,
        seller: seller._id,
        quantity: item.quantity,
        price: sellerDetails.price,
        discount: item.discount,
      });
    }

    const newCheckout = new Checkout({
      items: checkoutItems,
      shipping: shippingAddress,
      user: user._id,
    });

    const payment = await createPayment({
      amountInRial: newCheckout.totalPrice,
      description: `سفارش با شناسه ${newCheckout._id}`,
      mobile: "09336085012",
    });

    newCheckout.authority = payment.authority;

    await newCheckout.save();

    return successResponse(res, 201, {
      message: "Checkout created successfully :))",
      checkout: newCheckout,
      paymentUrl: payment.paymentUrl,
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyCheckout = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
