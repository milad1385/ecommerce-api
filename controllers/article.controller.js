const { isValidObjectId } = require("mongoose");
const Article = require("../models/Article");
const ArticleCategory = require("../models/ArticleCategory");
const { errorResponse, successResponse } = require("../helpers/responses");
const { createArticleValidator } = require("../validators/article.valodator");

exports.getAllPublishedArticles = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};
