const { isValidObjectId } = require("mongoose");
const { errorResponse, successResponse } = require("../helpers/responses");
const Product = require("../models/product");
const { createCommentValidator } = require("../validators/comment.validator");
const Comment = require("../models/comment");

exports.createComment = async (req, res, next) => {
  try {
    const { productId, content, rating } = req.body;

    if (!isValidObjectId(productId)) {
      return errorResponse(res, 400, "Please send valid product Id");
    }

    await createCommentValidator.validate(req.body, { abortEarly: false });

    const product = await Product.findOne({ _id: productId });

    if (!product) {
      return errorResponse(res, 404, "Product not found !!!");
    }

    const newComment = await Comment.create({
      content,
      product: productId,
      rating,
      user: req.user._id,
    });

    return successResponse(res, 201, {
      message: "Comment sent successfully :)",
      comment: newComment,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllComments = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.updateComment = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.createReplyComment = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.deleteReplyComment = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.updateReplyComment = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
