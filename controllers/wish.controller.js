const { isValidObjectId } = require("mongoose");
const Product = require("../models/product");
const WishList = require("../models/wish");
const { errorResponse } = require("../helpers/responses");
exports.getAllWishList = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const user = req.user;

    const wishList = await WishList.find({ user: user._id })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate(
        "user product",
        "-addresses -filterValues -customFilters -sellers"
      )
      .sort({ createdAt: -1 });

    return successResponse(res, 200, { wishList });
  } catch (error) {
    next(error);
  }
};

exports.addToWishList = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    if (!isValidObjectId(productId)) {
      return errorResponse(res, 400, "Product Id is not valid :(");
    }

    const product = await Product.findOne({ _id: productId });

    if (!product) {
      return errorResponse(res, 404, "This product is not found !!!");
    }

    const isExistWish = await WishList.findOne({
      user: user._id,
      product: productId,
    });

    if (isExistWish) {
      return errorResponse(res, 400, "This product is already wished !!!");
    }

    const newWish = await WishList.create({
      user: user._id,
      product: productId,
    });

    return successResponse(res, 200, {
      message: "Wish added successfully :)",
      wish: newWish,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteFromWishList = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    if (!isValidObjectId(productId)) {
      return errorResponse(res, 400, "Product Id is not valid :(");
    }

    const product = await Product.findOne({ _id: productId });

    if (!product) {
      return errorResponse(res, 404, "This product is not found !!!");
    }

    const deletedWishList = await WishList.findOneAndDelete({
      user: user._id,
      product: productId,
    });

    return successResponse(res, 200, {
      message: "WishList removed successfully :)",
      Wish: deletedWishList,
    });
  } catch (error) {
    next(error);
  }
};
