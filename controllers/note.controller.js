const { isValidObjectId } = require("mongoose");
const { errorResponse, successResponse } = require("../helpers/responses");
const Product = require("../models/product");
const Note = require("../models/note");
const { createPagination } = require("../utils/pagination");

exports.getUserNotes = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const user = req.user;

    const notes = await Note.find({ user: user._id })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("user product")
      .sort({ createdAt: -1 })
      .lean();

    const productNotes = notes.map((note) => ({
      product: note.product,
      note: {
        _id: note._id,
        content: note.content,
        createdAt: note.createdAt,
      },
    }));

    const userTotalNotes = await Note.countDocuments({ user: user._id });

    return successResponse(res, 200, {
      notes: productNotes,
      pagination: createPagination(page, limit, userTotalNotes, "Notes"),
    });
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

exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = req.user;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 422, "PLease send valid id !!!");
    }

    const note = await Note.findOne({ user: user._id })
      .populate("user product")
      .lean();

    if (!note) {
      return errorResponse(res, 404, "Note not found !!!");
    }

    if (note.user._id.toString() !== user._id.toString()) {
      return errorResponse(
        res,
        403,
        "You don't have access to see this note !!!"
      );
    }

    const product = {
      ...note.product,
      note: {
        _id: note._id,
        content: note.content,
        createdAt: note.createdAt,
        creator: note.user,
      },
    };

    return successResponse(res, 200, {
      product,
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const { content } = req.body;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 422, "Please send valid id !!!");
    }

    const existingNote = await Note.findOne({ user: user._id }).populate(
      "user"
    );

    if (!existingNote) {
      return errorResponse(res, 404, "Note not found !!!");
    }

    if (user._id.toString() !== existingNote.user._id.toString()) {
      return errorResponse(
        res,
        403,
        "You don't have access to update this note !!!"
      );
    }

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      {
        content,
      },
      { new: true }
    );

    return successResponse(res, 200, {
      message: "note updated successfully :)",
      note: updatedNote,
    });
  } catch (error) {
    next(error);
  }
};
