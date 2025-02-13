const { sendOtpValidator } = require("../validators/auth.validator");

exports.send = async (req, res, next) => {
  try {
    const { phone } = req.body;

    await sendOtpValidator.validate(req.body, { abortEarly: false });

    
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
