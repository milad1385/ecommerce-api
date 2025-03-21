const yup = require("yup");

exports.createArticleValidator = yup.object({
  title: yup.string().required("Title is required !!!"),
  authorId: yup
    .string()
    .required("Product ID is required")
    .test("is-valid-object-id", "Invalid product ID", (value) =>
      isValidObjectId(value)
    ),
  body: yup.string().required("body is required !!!"),
  shortName: yup.string().required("Short name is required !!!"),
  categories: yup.array().required("categories is required !!!"),
});
