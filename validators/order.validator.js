const yup = require("yup");

const updateOrderValidator = yup.object({
  status: yup
    .string()
    .required("Status is required")
    .oneOf(["PROCESSING", "SHIPPED", "DELIVERED"]),
  postTrackingCode: yup.string(),
});

module.exports = {
  updateOrderValidator,
};
