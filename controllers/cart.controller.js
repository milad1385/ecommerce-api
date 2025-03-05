const { isValidObjectId } = require("mongoose");
const Cart = require("../models/cart");
const Product = require("../models/product");
const Seller = require("../models/seller");
const { addToCartValidator } = require("../validators/cart.validator");
const { errorResponse, successResponse } = require("../helpers/responses");

exports.addToCart = async (req, res, next) => {
  try {
    const user = req.user;
    const { productId, sellerId, quantity } = req.body;

    if (!isValidObjectId(sellerId) || !isValidObjectId(productId)) {
      return errorResponse(res, 400, "Seller or Product id is not correct !!");
    }

    await addToCartValidator.validate(req.body, { abortEarly: false });

    const product = await Product.findById(productId);

    if (!product) {
      return errorResponse(res, 404, "Product not found !!!");
    }

    const seller = await Seller.findById(sellerId);

    if (!seller) {
      return errorResponse(res, 404, "Seller not found !!!");
    }

    const sellerDetails = product.sellers.find(
      (item) => item.seller.toString() === sellerId.toString()
    );

    if (!sellerDetails) {
      return errorResponse(res, 404, "Seller is not found !!!");
    }

    const cart = await Cart.findOne({
      user: user._id,
    });

    if (!cart) {
      const newCart = await Cart.create({
        user: user._id,
        items: [
          {
            product: productId,
            seller: sellerId,
            price:
              sellerDetails.price -
              (sellerDetails.discount * sellerDetails.price) / 100,
            discount: (sellerDetails.discount * sellerDetails.price) / 100,
            quantity,
          },
        ],
      });

      return successResponse(res, 201, {
        message: "Cart added successfully :)",
        cart: newCart,
      });
    }

    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId.toString() &&
        item.seller.toString() === sellerId.toString()
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        seller: sellerId,
        price:
          sellerDetails.price -
          (sellerDetails.discount * sellerDetails.price) / 100,
        discount: (sellerDetails.discount * sellerDetails.price) / 100,
        quantity,
      });
    }

    await cart.save();

    return successResponse(res, 200, { cart });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.getAllCarts = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
