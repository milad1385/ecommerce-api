const { isValidObjectId } = require("mongoose");
const { errorResponse, successResponse } = require("../helpers/responses");
const ArticleCategory = require("../models/ArticleCategory");
const Article = require("../models/Article");
const {
  createArticleCategoryValidator,
  editArticleCategoryValidator,
} = require("../validators/articleCategory.validator");
const fs = require("fs");
const { createPagination } = require("../utils/pagination");

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
    const articleCategories = await ArticleCategory.find({});
    return successResponse(res, 200, { articleCategories });
  } catch (error) {
    next(error);
  }
};

exports.getAllArticlesCategoryAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const articleCategories = await ArticleCategory.find({})
      .skip((page - 1) * limit)
      .limit(limit);

    const totalArticlesCategory = await ArticleCategory.countDocuments({});

    return successResponse(res, 200, {
      articleCategories,
      pagination: createPagination(
        page,
        limit,
        totalArticlesCategory,
        "articleCategories"
      ),
    });
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
    const { id } = req.params;
    const { name, shortName, description } = req.body;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 404, "id is not valid !!!");
    }

    await editArticleCategoryValidator.validate(req.body, {
      abortEarly: false,
    });

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

    const articleCategory = await ArticleCategory.findOne({ _id: id });

    const updatedArticleCategory = await ArticleCategory.findByIdAndUpdate(
      id,
      {
        $set: {
          description,
          name,
          pic: icon ? icon : articleCategory.pic,
        },
      },
      { new: true }
    );

    if (!updatedArticleCategory) {
      return errorResponse(res, 404, "article category is not found !!!");
    }

    return successResponse(res, 200, {
      message: "article category updated successfully :)",
      articleCategory: updatedArticleCategory,
    });
  } catch (error) {
    next(error);
  }
};
