const { getOtpDetails, generateOtp } = require("../helpers/auth");
const { errorResponse, successResponse } = require("../helpers/responses");
const Ban = require("../models/ban");
const { sendMessage } = require("../services/otp");
const { sendOtpValidator } = require("../validators/auth.validator");

exports.send = async (req, res, next) => {
  try {
    const { phone } = req.body;

    await sendOtpValidator.validate(req.body, { abortEarly: false });

    const isBanned = await Ban.findOne({ phone });

    if (isBanned) {
      return errorResponse(res, 403, "User with this phone was banned !!!");
    }

    const { expire, remainingTime } = await getOtpDetails(phone);

    if (!expire) {
      return successResponse(res, 200, {
        message: `OTP already sent, Please try again after ${remainingTime}`,
      });
    }

    const otp = await generateOtp(phone);

    await sendMessage(phone, otp);

    return successResponse(res, 200, { message: "otp sent successfully :))" });
  } catch (error) {
    next(error);
  }
};

exports.verify = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.me = async (req, res, next) => {};
