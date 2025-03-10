const yup = require("yup");

exports.createDepartmentValidator = yup.object({
  title: yup.string().required("title is required !!! "),
});

exports.updateDepartmentValidator = yup.object({
  title: yup.string(),
});

exports.createSubDepartmentValidator = yup.object({
  title: yup.string().required("title is required !!!"),
  department: yup.string().required("department is required !!!"),
});
