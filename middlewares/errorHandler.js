const { errorResponse } = require("../helpers/responses");

module.exports = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    const errors = [];

    err.inner.forEach((e) => {
      errors.push({
        field: e.path,
        message: e.message,
      });
    });

    console.log({ success: false, error: "Validation error", data: errors });
    return errorResponse(res, 400, "Validation error", errors);
  }

  let message = err.message || "Internal Server Error";
  let status = err.status || 500;

  console.log({ success: false, error: message });

  return errorResponse(res, status, message);
};
