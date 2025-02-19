const yup = require("yup");

const createAddressValidator = yup.object({
  name: yup.string().required("Name is required").min(3).max(255),

  postalCode: yup.string().required("Postal code is required").length(10),

  address: yup
    .string()
    .required("Address is required")
    .min(6)
    .max(1000, "Address cannot exceed 1000 characters"),

  location: yup.object().shape({
    lat: yup.number().required("Latitude is required").min(-90).max(90),
    lng: yup.number().required("Longitude is required").min(-180).max(180),
  }),

  cityId: yup.number().required("City is required").positive().integer(),
});

const updateAddressValidator = yup.object({
  name: yup.string().min(3).max(255),

  postalCode: yup.string().length(10),

  address: yup
    .string()
    .min(6)
    .max(1000, "Address cannot exceed 1000 characters"),

  location: yup.object().shape({
    lat: yup.number().min(-90).max(90),
    lng: yup.number().min(-180).max(180),
  }),

  cityId: yup.number().positive().integer(),
});

module.exports = {
  createAddressValidator,
  updateAddressValidator,
};
