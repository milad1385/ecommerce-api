const { isValidObjectId } = require("mongoose");
const { errorResponse, successResponse } = require("../helpers/responses");
const Product = require("../models/product");
const Note = require("../models/note");

exports.getAll = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { productId, content } = req.body;
    const user = req.user;

    if (!isValidObjectId(productId)) {
      return errorResponse(res, 422, "PLease send valid id !!!");
    }

    const isExistProduct = await Product.findOne({ _id: productId });

    if (!isExistProduct) {
      return errorResponse(res, 404, "Product not found !!!");
    }

    const isExistNote = await Note.findOne({
      user: user._id,
      product: productId,
    });

    if (isExistNote) {
      return errorResponse(
        res,
        400,
        "This Note for this product is already exist !!!"
      );
    }

    const newNote = await Note.create({
      content,
      product: productId,
      user,
    });

    return successResponse(res, 201, {
      message: "Note created successfully :)",
      note: newNote,
    });
  } catch (error) {
    next(error);
  }
};
