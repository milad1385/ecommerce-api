const { isValidObjectId } = require("mongoose");
const Cart = require("../models/cart");
const Product = require("../models/product");
const Seller = require("../models/seller");
const {
  addToCartValidator,
  removeFromCartValidator,
} = require("../validators/cart.validator");
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

exports.removeFromCart = async (req, res, next) => {
  try {
    const { sellerId, productId } = req.body;

    const user = req.user;

    if (!isValidObjectId(sellerId) || !isValidObjectId(productId)) {
      return errorResponse(res, 400, "Seller or Product id is not correct !!");
    }

    await removeFromCartValidator.validate(req.body, { abortEarly: false });

    const cart = await Cart.findOne({ user: user._id });

    if (!cart) {
      return errorResponse(res, 404, "User Cart not found !!!");
    }

    const cartIndex = cart.items.findIndex(
      (item) =>
        item.seller.toString() === sellerId.toString() &&
        item.product.toString() === productId.toString()
    );

    if (cartIndex === -1) {
      return errorResponse(res, 404, "Item not found !!!");
    }

    cart.items.splice(cartIndex, 1);

    await cart.save();

    return errorResponse(res, 200, {
      message: "Cart removed successfully:))",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllCart = async (req, res, next) => {
  try {
    const user = req.user;

    const cart = await Cart.findOne({ user: user._id })
      .populate("items.product")
      .populate("items.seller");

    return successResponse(res, 200, {
      cart,
    });
  } catch (error) {
    next(error);
  }
};

exports.decreaseQty = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const user = req.user;

    if (!isValidObjectId(itemId)) {
      return errorResponse(res, 404, "Item id is not valid !!!");
    }

    const cart = await Cart.findOne({ user: user._id });

    if (!cart) {
      return errorResponse(res, 404, "Cart not found !!!");
    }

    const existingItem = cart.items.id(itemId);

    if (!existingItem) {
      return errorResponse(res, 404, "Item is not found !!!");
    }

    if (existingItem.quantity === 1) {
      const carts = await Cart.findOneAndUpdate(
        { user: user._id },
        {
          $pull: { items: existingItem._id },
        },
        { new: true }
      );

      return successResponse(res, 200, {
        message: "This product removed successfully :)",
        carts,
      });
    } else {
      existingItem.quantity -= 1;
    }

    await cart.save();

    return successResponse(res, 200, { cart });
  } catch (error) {
    next(error);
  }
};
