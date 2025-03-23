const { isValidObjectId } = require("mongoose");
const yup = require("yup");

exports.createArticleValidator = yup.object({
  title: yup.string().required("Title is required !!!"),
  body: yup.string().required("body is required !!!"),
  shortName: yup.string().required("Short name is required !!!"),
  categories: yup.array().required("categories is required !!!"),
  status: yup
    .string()
    .oneOf(["published", "draft", "reject"])
    .required("status is required !!!"),
});

exports.updateArticleValidator = yup.object({
  title: yup.string(),
  body: yup.string(),
  shortName: yup.string(),
  categories: yup.array(),
  status: yup.string().oneOf(["published", "draft", "reject"]),
});

exports.changeArticleStatusValidator = yup.object({
  status: yup
    .string()
    .oneOf(["published", "draft", "reject"])
    .required("status is required !!!"),
  articleId: yup
    .string()
    .required("article ID is required")
    .test("is-valid-object-id", "Invalid article ID", (value) =>
      isValidObjectId(value)
    ),
});
