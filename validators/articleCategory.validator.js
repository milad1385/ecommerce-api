const yup = require("yup");

exports.createArticleCategoryValidator = yup.object({
  name: yup.string().required("name is required !!!"),
  shortName: yup.string().required("Short name is required !!!"),
  description: yup.string().required("description is required !!!"),
});
