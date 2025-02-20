const cities = require("../cities/cities.json");
const provinces = require("../cities/provinces.json");
const { successResponse } = require("../helpers/responses");

exports.get = async (req, res, next) => {
  try {
    return successResponse(res, 200, {
      cities,
      provinces,
    });
  } catch (error) {
    next(error);
  }
};
