const yup = require("yup");

const createSellerValidator = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .max(255, "Name cannot exceed 255 characters"),

  contactDetails: yup.object().shape({
    phone: yup.string().required("Phone is required").trim(),
    email: yup.string().required("Email is required"),
  }),

  cityId: yup.number().required("City is required").positive().integer(),
});

const updateSellerValidator = yup.object().shape({
  name: yup.string().max(255, "Name cannot exceed 255 characters"),

  contactDetails: yup.object().shape({
    phone: yup.string().trim(),
  }),

  cityId: yup.number().positive().integer(),
});

module.exports = { createSellerValidator, updateSellerValidator };
