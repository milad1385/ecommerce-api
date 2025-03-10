const yup = require("yup");

exports.createDepartmentValidator = yup.object({
  title: yup.string().required("title is required !!! "),
});

exports.updateDepartmentValidator = yup.object({
  title: yup.string(),
});
