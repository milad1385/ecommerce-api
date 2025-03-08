const { isValidObjectId } = require("mongoose");
const { errorResponse, successResponse } = require("../helpers/responses");
const Bookmark = require("../models/bookmark");
const Product = require("../models/product");

exports.getAllBookmarks = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.addToBookmark = async (req, res, next) => {
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

    const isExistBookmark = await Bookmark.findOne({
      user: user._id,
      product: productId,
    });

    if (isExistBookmark) {
      return errorResponse(res, 400, "This product is already bookmarked !!!");
    }

    const bookmark = await Bookmark.create({
      user: user._id,
      product: productId,
    });

    return successResponse(res, 200, {
      message: "Bookmark added successfully :)",
      bookmark,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteFromBookmark = async (req, res, next) => {
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

    const deletedBookmark = await Bookmark.findOneAndDelete({
      user: user._id,
      product: productId,
    });

    return successResponse(res, 200, {
      message: "Bookmark removed successfully :)",
      bookmark: deletedBookmark,
    });
  } catch (error) {
    next(error);
  }
};
