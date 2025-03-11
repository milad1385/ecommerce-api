const { errorResponse, successResponse } = require("../helpers/responses");
const Cart = require("../models/cart");
const Checkout = require("../models/checkout");
const Order = require("../models/order");
const Product = require("../models/product");
const { createPayment, verifyPayment } = require("../services/zarinpal");

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
    const { Status, Authority: authority } = req.query;

    const alreadyCreatedOrder = await Order.findOne({ authority });
    if (alreadyCreatedOrder) {
      return errorResponse(res, 400, "Payment already verified !!");
    }

    const checkout = await Checkout.findOne({ authority });
    if (!checkout) {
      return errorResponse(res, 404, "Checkout not found !!");
    }

    const payment = await verifyPayment({
      authority,
      amountInRial: checkout.totalPrice,
    });

    if (![100, 101].includes(payment.code)) {
      return errorResponse(res, 400, "Payment not verified !!");
    }

    const order = await Order.create({
      user: checkout.user,
      authority: checkout.authority,
      items: checkout.items,
      shipping: checkout.shipping,
    });

    for (const item of checkout.items) {
      const product = await Product.findById(item.product);

      if (product) {
        const sellerInfo = product.sellers.find(
          (sellerData) =>
            sellerData.seller.toString() === item.seller.toString()
        );

        sellerInfo.stock -= item.quantity;
        await product.save();
      }
    }

    await Cart.findOneAndUpdate({ user: checkout.user }, { items: [] });

    await Checkout.deleteOne({ _id: checkout._id });

    return successResponse(res, 200, {
      message: "Payment verified :))",
      order,
    });
  } catch (error) {
    next(error);
  }
};
