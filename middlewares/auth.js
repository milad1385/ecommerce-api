const { errorResponse } = require("../helpers/responses");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Ban = require("../models/ban");
exports.auth = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
      return errorResponse(res, 401, "Please send accessToken !!!");
    }

    console.log(accessToken);
    

    const tokenArray = accessToken.split(" ");
    const token = tokenArray[1];

    if (tokenArray[0] !== "Bearer") {
      return errorResponse(
        res,
        401,
        "Write [Bearer ] at the start ot the token"
      );
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!payload) {
      return errorResponse(res, 401, "Token is not valid !!");
    }

    const user = await User.findOne({ _id: payload.id });

    if (!user) {
      return errorResponse(res, 404, "User is not found !!!");
    }

    const isBanned = await Ban.findOne({ phone: user.phone });

    if (isBanned) {
      return errorResponse(res, 403, "this user was banned by admin");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
