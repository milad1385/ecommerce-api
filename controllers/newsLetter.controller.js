const { successResponse } = require("../helpers/responses");
const errorHandler = require("../middlewares/errorHandler");
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
      return errorHandler(res, 400, "This email is already exist !!!");
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
  } catch (error) {
    next(error);
  }
};
