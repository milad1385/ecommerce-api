const { isValidObjectId } = require("mongoose");
const { errorResponse, successResponse } = require("../helpers/responses");
const User = require("../models/user");
const Ban = require("../models/ban");

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

