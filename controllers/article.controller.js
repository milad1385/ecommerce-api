const { isValidObjectId } = require("mongoose");
const Article = require("../models/Article");
const ArticleCategory = require("../models/ArticleCategory");
const { errorResponse, successResponse } = require("../helpers/responses");
const { createArticleValidator } = require("../validators/article.valodator");
const { createPagination } = require("../utils/pagination");

exports.getAllPublishedArticles = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const articles = await Article.find({ status: "published" })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("author categories");

    const articlesCount = await Article.countDocuments({ status: "published" });

    return successResponse(res, 200, {
      articles,
      pagination: createPagination(page, limit, articlesCount, "Articles"),
    });
  } catch (error) {
    next(error);
  }
};

exports.createArticle = async (req, res, next) => {
  try {
    let { title, body, shortName, categories, status } = req.body;

    categories = JSON.parse(categories);
    const user = req.user;

    await createArticleValidator.validate(req.body, { abortEarly: false });

    if (!req.file) {
      return errorResponse(res, 400, "Please upload cover");
    }

    const newArticle = await Article.create({
      author: user._id,
      categories,
      body,
      cover: req.file.filename,
      shortName,
      status,
      title,
    });

    return successResponse(res, 201, {
      message: "Article created successfully :)",
      article: newArticle,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllArticles = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status = "all" } = req.query;

    const filters = {};

    if (status !== "all") {
      filters.status = status;
    }

    const articles = await Article.find(filters)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("author categories");

    const articlesCount = await Article.countDocuments(filters);

    return successResponse(res, 200, {
      articles,
      pagination: createPagination(page, limit, articlesCount, "Articles"),
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteArticle = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 400, "Please send valid id");
    }

    const deletedArticle = await Article.findByIdAndDelete(id);

    if (!deletedArticle) {
      return errorResponse(res, 404, "Article is not found !!!");
    }

    fs.unlink(`public/images/articles/${deletedArticle?.cover}`, (err) =>
      next(err)
    );

    return successResponse(res, 200, {
      message: "Article deleted successfully :)",
      article: deletedArticle,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateArticle = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.changeArticleStatus = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.getArticlesByCategory = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.getArticle = async (req, res, next) => {
  try {
    const { shortName } = req.params;

    if (!shortName) {
      return errorResponse(res, 400, "Please send short name of article");
    }

    const article = await Article.findOne({ shortName }).populate(
      "author categories"
    );

    if (!article) {
      return errorResponse(res, 404, "Article is not found !!!");
    }

    return successResponse(res, 200, { article });
  } catch (error) {
    next(error);
  }
};
