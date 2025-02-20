const { isValidObjectId } = require("mongoose");
const { errorResponse, successResponse } = require("../helpers/responses");
const User = require("../models/user");
const Ban = require("../models/ban");
const cities = require("../cities/cities.json");
const {
  createAddressValidator,
  updateAddressValidator,
} = require("../validators/address.validator");

exports.ban = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 422, "Please send valid id");
    }

    const user = await User.findOneAndDelete({ _id: id });

    if (!user) {
      return errorResponse(res, 404, "user not found !!!");
    }

    await Ban.create({
      phone: user.phone,
    });

    return successResponse(res, 200, {
      message: "user banned successfully :)",
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.addAddress = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 422, "Please send valid id");
    }

    await createAddressValidator.validate(req.body, { abortEarly: false });

    const city = cities.find((city) => +city.id === +req.body.cityId);

    if (!city) {
      return errorResponse(res, 404, "city not found !!!");
    }

    const user = await User.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          addresses: req.body,
        },
      },
      { new: true }
    );

    if (!user) {
      return errorResponse(res, 404, "user not found !!!");
    }

    return successResponse(res, 200, {
      message: "address added successfully :)",
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = req.user;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 422, "Please send valid id");
    }

    const address = await user.addresses.id(id);

    if (!address) {
      return errorResponse(res, 404, "address not found !!!");
    }

    await user.addresses.pull(id);

    await user.save();

    return successResponse(res, 200, {
      message: "address deleted successfully :)",
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, postalCode, address, location, cityId } = req.body;

    await updateAddressValidator.validate(req.body, { abortEarly: false });

    const user = req.user;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 422, "Please send valid id");
    }

    const city = cities.find((city) => +city.id === +cityId);

    if (!city) {
      return errorResponse(res, 404, "city not found !!!");
    }

    const userAddress = await user.addresses.id(id);

    if (!userAddress) {
      return errorResponse(res, 404, "address not found !!!");
    }

    userAddress.name = name || userAddress.name;
    userAddress.postalCode = postalCode || userAddress.postalCode;
    userAddress.address = address || userAddress.address;
    userAddress.location = location || userAddress.location;
    userAddress.cityId = cityId || userAddress.cityId;

    await user.save();

    return successResponse(res, 200, {
      message: "address updated successfully :)",
      user,
    });
  } catch (error) {
    next(error);
  }
};
