const { isValidObjectId } = require("mongoose");
const { errorResponse, successResponse } = require("../helpers/responses");
const { categoryValidator } = require("../validators/category.validator");
const Category = require("../models/category");

const supportedFormat = [
  "image/jpeg",
  "image/png",
  "image/svg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

exports.create = async (req, res, next) => {
  try {
    let { title, slug, parent, description, filters } = req.body;
    filters = JSON.parse(filters);

    await categoryValidator.validate(
      { title, slug, parent, description, filters },
      { abortEarly: false }
    );

    let icon = null;
    if (req.file) {
      const { filename, mimetype } = req.file;

      if (!supportedFormat.includes(mimetype)) {
        return errorResponse(res, 422, "Please choose image with this format", {
          supportedFormat,
        });
      }

      icon = {
        filename,
        path: `/images/category-icon/${filename}`,
      };
    }

    const category = await Category.create({
      title,
      slug,
      parent,
      description,
      filters,
      icon,
    });

    return successResponse(res, 201, {
      message: "Category created successfully :)",
      category,
    });
  } catch (error) {
    next(error);
  }
};


exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 422, "Please send valid id !!!");
    }
  } catch (error) {
    next(error);
  }
};
