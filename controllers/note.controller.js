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

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 422, "PLease send valid id !!!");
    }

    const note = await Note.findOne({ _id: id }).populate("user");

    if (note.user.toString() !== user._id.toString()) {
      return errorResponse(
        res,
        403,
        "You dont have access to delete this note !!!"
      );
    }

    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      return errorResponse(res, 404, "Note not found !!!");
    }

    return successResponse(res, 200, {
      message: "Note deleted successfully :))",
      note: deletedNote,
    });
  } catch (error) {
    next(error);
  }
};
