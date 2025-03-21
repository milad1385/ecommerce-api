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
