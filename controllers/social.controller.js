const { successResponse, errorResponse } = require("../helpers/responses");
const SocialMedia = require("../models/socialMedia");
const { createSocialValidator } = require("../validators/social.validator");

const supportedFormats = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "application/octet-stream",
];

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
    const { name, link } = req.body;
    await createSocialValidator.validate({ name, link }, { abortEarly: false });

    if (!req.file) {
      return errorResponse(
        res,
        400,
        `Category Icon is required - field:"icon"`
      );
    }
    const { filename, mimetype } = req.file;
    if (!supportedFormats.includes(mimetype)) {
      return errorResponse(res, 400, "Unsupported image format");
    }

    const icon = {
      filename: filename,
      path: `images/socials/${filename}`,
    };

    const newSocial = await SocialMedia.create({ icon, name, link });

    return successResponse(res, 201, {
      social: newSocial,
      message: "social media added successfully",
    });
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
