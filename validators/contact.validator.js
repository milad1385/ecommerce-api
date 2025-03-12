const yup = require("yup");

exports.createContactValidator = yup.object({
  content: yup.string().required("content is required !!!"),
  email: yup
    .string()
    .email("email is invalid !!!")
    .required("email is required !!!"),
  phone: yup
    .string()
    .required("phone is required !!")
    .min(11, "minimum number is 11")
    .max(11, "maximum number is 11"),
});

exports.updateContactValidator = yup.object({
  status: yup
    .string()
    .oneOf(
      ["answer", "pending"],
      "status must be one of [pending , answer] item"
    )
    .required("status is required !!!"),
  body: yup.string().required("content is required !!!"),
  email: yup
    .string()
    .email("email is invalid !!!")
    .required("email is required !!!"),
});
