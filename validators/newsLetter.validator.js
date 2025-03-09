const yup = require("yup");

exports.createNewsLetterValidator = yup.object({
  email: yup
    .string()
    .required("phone number is required !!! ")
    .email("Email is not valid !!!"),
});
