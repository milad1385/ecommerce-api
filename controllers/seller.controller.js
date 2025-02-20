const { errorResponse, successResponse } = require("../helpers/responses");
const Seller = require("../models/seller");
const { createSellerValidator } = require("../validators/seller.validator");
const cities = require("../cities/cities.json");

exports.create = async (req, res, next) => {
  try {
    const { name, contactDetails, cityId } = req.body;
    const user = req.user;

    await createSellerValidator.validate(req.body, { abortEarly: false });

    const isExsitingSeller = await Seller.findOne({ user: user._id });

    if (isExsitingSeller) {
      return errorResponse(res, 422, "This seller is already exist !!!");
    }

    const city = cities.find((city) => +city.id === +cityId);

    if (!city) {
      return errorResponse(res, 409, "City is not valid !!");
    }

    const seller = await Seller.create({
      cityId,
      contactDetails,
      name,
      user: user._id,
    });

    return successResponse(res, 201, {
      message: "Seller created successfully :)",
      seller,
    });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const user = req.user;

    const isExsitingUser = await Seller.findOne({ user: user._id });

    if (!isExsitingUser) {
      return errorResponse(res, 404, "Seller not found !!!");
    }

    const deletedSeller = await Seller.findOneAndDelete({ user: user._id });

    return successResponse(res, 200, {
      message: "Seller deleted successfully :)",
      deletedSeller,
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.get = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
