const { default: mongoose } = require("mongoose");
const yup = require("yup");

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const createSellerRequestValidator = yup.object().shape({
  productId: yup
    .string()
    .required("Product ID is required")
    .test(
      "is-valid-objectid",
      "Product ID must be a valid ObjectId",
      isValidObjectId
    ),

  price: yup
    .number()
    .required("Price is required")
    .positive("Price must be a positive number")
    .min(1, "Price must be at least 1"),

  stock: yup
    .number()
    .required("Stock is required")
    .integer("Stock must be an integer")
    .min(1, "Stock must be at least 1"),

  periority: yup
    .number()
    .required("periority is required")
    .integer("periority must be an integer")
    .oneOf([1, 2, 3], "periority must be 1 or 2 or 3 !!!"),

  discount: yup
    .number()
    .required("periority is required")
    .integer("periority must be an integer"),
});

const updateSellerRequestValidator = yup.object().shape({
  status: yup
    .string()
    .required("Status is required")
    .oneOf(["accept", "reject"]),

  adminComments: yup
    .string()
    .max(1000, "Comment cannot exceed 1000 characters"),
});

module.exports = { createSellerRequestValidator, updateSellerRequestValidator };
