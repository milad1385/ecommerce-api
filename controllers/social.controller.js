const { successResponse } = require("../helpers/responses");
const Social = require("../models/socialMedia");

exports.getAll = async (req, res, next) => {
  try {
    const socials = await Social.find({});

    return successResponse(res, 200, { socials });
  } catch (error) {
    next(error);
  }
};

exports.createSocial = async (req, res, next) => {
  try {
    
  } catch (error) {
    next(error);
  }
};

exports.deleteSocial = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
