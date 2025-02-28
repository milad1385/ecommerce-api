const yup = require("yup");

exports.createCommentValidator = yup.object({
  productId: yup
    .string()
    .uuid("productId is not uuid !!!")
    .required("product Id is required !!!"),
  content: yup.string().required("content is required !!!"),
  rating: yup
    .number()
    .min(1, "minimum number is 1")
    .max(5, "maximum number is 5"),
});

