const { isValidObjectId } = require("mongoose");
const { successResponse, errorResponse } = require("../helpers/responses");
const NewsLetter = require("../models/newsLetter");
const { createPagination } = require("../utils/pagination");
const {
  createNewsLetterValidator,
} = require("../validators/newsLetter.validator");
exports.getAllNewsLetter = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const newsLetters = await NewsLetter.find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const newsLettersCount = await NewsLetter.countDocuments({});

    return successResponse(res, 200, {
      newsLetters,
      pagination: createPagination(
        page,
        limit,
        newsLettersCount,
        "News Letter"
      ),
    });
  } catch (error) {
    next(error);
  }
};

exports.createNewsLetter = async (req, res, next) => {
  try {
    const { email } = req.body;

    await createNewsLetterValidator.validate(req.body, { abortEarly: false });

    const isExistNewsLetter = await NewsLetter.findOne({ email });

    if (isExistNewsLetter) {
      return errorResponse(res, 400, "This email is already exist !!!");
    }

    const newsLetter = await NewsLetter.create({
      email,
    });

    return successResponse(res, 200, {
      message: "News Letter created successfully :)",
      newsLetter,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteNewsLetter = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 400, "Please send valid id !!!");
    }

    const deletedNewsLetter = await NewsLetter.findOneAndDelete({ _id: id });

    if (!deletedNewsLetter) {
      return errorResponse(res, 404, "News letter is not found !!!");
    }

    return successResponse(res, 200, {
      message: "newsletter deleted successfully :)",
      newsLetter: deletedNewsLetter,
    });
  } catch (error) {
    next(error);
  }
};
