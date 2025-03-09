const { isValidObjectId } = require("mongoose");
const { successResponse, errorResponse } = require("../helpers/responses");
const SocialMedia = require("../models/socialMedia");
const {
  createSocialValidator,
  updateSocialValidator,
} = require("../validators/social.validator");
const fs = require("fs");

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
    const socials = await SocialMedia.find({});

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
    const { socialId } = req.params;

    if (!isValidObjectId(socialId)) {
      return errorResponse(res, 400, "PLease send valid id");
    }

    const deletedSocial = await SocialMedia.findByIdAndDelete(socialId);

    if (!deletedSocial) {
      return errorResponse(res, 404, "Social is not found !!!");
    }

    fs.unlink(`public/images/socials/${deletedSocial.icon.filename}`, (err) =>
      next(err)
    );

    return successResponse(res, 200, {
      message: "social deleted successfully :)",
      social: deletedSocial,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateSocialMedia = async (req, res, next) => {
  try {
    const { socialId } = req.params;
    const { name, link } = req.body;

    if (!isValidObjectId(socialId)) {
      return errorResponse(res, 400, "Please send valid socialId !!!");
    }

    await updateSocialValidator.validate({ name, link }, { abortEarly: false });

    const oldData = await SocialMedia.findOne({ _id: socialId });

    let icon = undefined;
    if (req.file) {
      const { filename, mimetype } = req.file;

      if (!supportedFormats.includes(mimetype)) {
        return errorResponse(res, 400, "Unsupported image format");
      }

      if (oldData.icon?.filename) {
        try {
          fs.unlinkSync(`public/images/socials/${deletedSocial.icon.filename}`);
        } catch (err) {
          console.log(err);
        }
      }
      icon = {
        filename: filename,
        path: `images/socials/${filename}`,
      };
    }

    const socialMedia = await SocialMedia.findByIdAndUpdate(
      socialId,
      { icon: icon ? icon : oldData.icon, name, link },
      {
        new: true,
      }
    );
    if (!socialMedia) return errorResponse(res, 400, "Social media not found");

    return successResponse(res, 200, {
      social: socialMedia,
      message: "social media edited successfully",
    });
  } catch (error) {
    next(error);
  }
};
