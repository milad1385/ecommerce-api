const { isValidObjectId } = require("mongoose");
const { errorResponse, successResponse } = require("../helpers/responses");
const Product = require("../models/product");
const {
  createCommentValidator,
  acceptOrRejectCommentValidator,
  createReplyCommentValidator,
} = require("../validators/comment.validator");
const Comment = require("../models/comment");
const { createPagination } = require("../utils/pagination");

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
    const { productId, page = 1, limit = 10 } = req.query;

    if (!isValidObjectId(productId)) {
      return errorResponse(res, 422, "Please sent valid product Id !!!");
    }

    const product = await Product.findOne({ _id: productId });

    if (!product) {
      return errorResponse(res, 404, "Product not found !!!");
    }

    const commentsCount = await Comment.countDocuments({
      product: productId,
      status: "accepted",
    });

    const comments = await Comment.find({
      product: productId,
      status: "accepted",
    })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("product replies.user");

    return successResponse(res, 200, {
      comments,
      pagination: createPagination(page, limit, commentsCount, "Comments"),
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 422, "CommentId is not valid !!!");
    }

    const deletedComment = await Comment.findByIdAndDelete(id);

    if (!deletedComment) {
      return errorResponse(res, 404, "Comment not found !!!");
    }

    return successResponse(res, 200, {
      message: "Comment deleted successfully :)",
      comment: deletedComment,
    });
  } catch (error) {
    next(error);
  }
};

exports.acceptOrRejectComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { status } = req.body;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 422, "CommentId is not valid !!!");
    }

    await acceptOrRejectCommentValidator.validate(req.body, {
      abortEarly: false,
    });

    const comment = await Comment.findOne({ _id: id });

    if (!comment) {
      return errorResponse(res, 404, "Comment not found !!!");
    }

    if (status === "reject") {
      comment.status = "rejected";
    } else {
      comment.status = "accepted";
    }

    await comment.save();

    return successResponse(res, 200, {
      message: `Comment ${status}ed successfully :)`,
      [`${status}ed comment`]: comment,
    });
  } catch (error) {
    next(error);
  }
};

exports.createReplyComment = async (req, res, next) => {
  try {
    const user = req.user;
    const { content } = req.body;
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 422, "Please send valid id !!!");
    }

    await createReplyCommentValidator.validate(req.body, { abortEarly: false });

    const comment = await Comment.findByIdAndUpdate(
      { _id: id },
      {
        $push: {
          replies: {
            user,
            content,
          },
        },
      },
      { new: true }
    );

    if (!comment) {
      return errorResponse(res, 404, "Comment not found !!!");
    }

    return successResponse(res, 200, {
      message: "reply comment added successfully :)",
      comment,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteReplyComment = async (req, res, next) => {
  try {
    const { id, replyId } = req.params;

    if (!isValidObjectId(id) || !isValidObjectId(replyId)) {
      return errorResponse(res, 422, "Please send valid id !!!");
    }

    const comment = await Comment.findByIdAndUpdate(
      id,
      {
        $pull: {
          replies: { _id: replyId },
        },
      },
      { new: true }
    );

    return successResponse(res, 200, {
      message: "reply comment deleted successfully :)",
    });
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
