const redis = require("../configs/redis");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  getOtpDetails,
  generateOtp,
  getPhoneByPattern,
} = require("../helpers/auth");
const { errorResponse, successResponse } = require("../helpers/responses");
const Ban = require("../models/ban");
const { sendMessage } = require("../services/otp");
const {
  sendOtpValidator,
  otpVerifyValidator,
} = require("../validators/auth.validator");
const User = require("../models/user");

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
    const { phone, otp, isSeller } = req.body;

    await otpVerifyValidator.validate(req.body, { abortEarly: false });

    const savedOtp = await redis.get(getPhoneByPattern(phone));

    if (!savedOtp) {
      return errorResponse(
        res,
        401,
        "Otp code was expired please try again !!!"
      );
    }

    const isOtpValid = await bcrypt.compare(otp, savedOtp);

    if (!isOtpValid) {
      return errorResponse(res, 401, "Otp code is wrong !!!");
    }

    const existingUser = await User.findOne({ phone });

    if (existingUser) {
      const accessToken = jwt.sign(
        { id: existingUser._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRE_IN_SECOND + "s" }
      );

      return successResponse(res, 200, {
        message: "user login successfully :)",
        user: existingUser,
        token: accessToken,
      });
    }

    const isFirstUser = (await User.countDocuments({})) === 0;

    const user = await User.create({
      phone,
      username: `user-${phone}`,
      roles: isFirstUser ? ["ADMIN"] : isSeller ? ["SELLER", "USER"] : ["USER"],
    });

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE_IN_SECOND + "s",
    });

    return successResponse(res, 201, {
      message: "User registed successfully :))",
      token: accessToken,
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.me = async (req, res, next) => {
  try {
    const user = req.user;

    return successResponse(res, 200, { user });
  } catch (error) {
    next(error);
  }
};
