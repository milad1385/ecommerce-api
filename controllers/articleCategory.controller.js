const { isValidObjectId } = require("mongoose");
const { errorResponse, successResponse } = require("../helpers/responses");
const ArticleCategory = require("../models/ArticleCategory");
const Article = require("../models/Article");
const {
  createArticleCategoryValidator,
} = require("../validators/articleCategory.validator");
const fs = require("fs");

const supportedFormat = [
  "image/jpeg",
  "image/png",
  "image/svg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

exports.getAllArticlesCategory = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.createArticleCategory = async (req, res, next) => {
  try {
    const { name, shortName, description } = req.body;

    await createArticleCategoryValidator.validate(req.body, {
      abortEarly: false,
    });

    const isExistArticleCategory = await ArticleCategory.findOne({
      name,
      shortName,
    });

    if (isExistArticleCategory) {
      return errorResponse(
        res,
        422,
        "This Article category is already exist !!!"
      );
    }

    let icon = null;
    if (req.file) {
      const { filename, mimetype } = req.file;

      if (!supportedFormat.includes(mimetype)) {
        return errorResponse(res, 422, "Please choose image with this format", {
          supportedFormat,
        });
      }

      icon = {
        filename,
        path: `/images/category-icon/${filename}`,
      };
    }

    if (!icon) {
      return errorResponse(
        res,
        400,
        "Please upload article category image !!!"
      );
    }

    const newArticleCategory = await ArticleCategory.create({
      description,
      name,
      pic: icon,
      shortName,
    });

    return successResponse(res, 201, {
      message: "Article category created successfully :)",
      articleCategory: newArticleCategory,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteArticleCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 404, "id is not valid !!!");
    }

    const deletedArticleCategory = await ArticleCategory.findByIdAndDelete(id);

    if (!deletedArticleCategory) {
      return errorResponse(res, 404, "article category is not found !!!");
    }

    fs.unlink(
      `public/images/articleCategory/${deletedArticleCategory.pic.filename}`,
      (err) => next(err)
    );

    await Article.deleteMany({
      categories: { $in: [deletedArticleCategory._id] },
    });

    return successResponse(res, 200, {
      message: "Category article deleted successfully :)",
      categoryArticle: deletedArticleCategory,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateArticleCategory = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
