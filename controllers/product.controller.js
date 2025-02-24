const { isValidObjectId } = require("mongoose");
const { errorResponse, successResponse } = require("../helpers/responses");
const SubCategory = require("../models/subCategory");
const { createProductValidator } = require("../validators/product.validator");
const { nanoid } = require("nanoid");
const Product = require("../models/product");
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
    let {
      name,
      slug,
      sellers,
      description,
      subCategory,
      filterValues,
      customFilters,
    } = req.body;

    filterValues = JSON.parse(filterValues);
    customFilters = JSON.parse(customFilters);
    sellers = JSON.parse(sellers);

    console.log(sellers);
    

    await createProductValidator.validate(
      {
        name,
        slug,
        sellers,
        description,
        subCategory,
        filterValues,
        customFilters,
      },
      { abortEarly: false }
    );

    if (!isValidObjectId(subCategory)) {
      return errorResponse(res, 422, "Please send valid subCategory id");
    }

    const isExsitSubCategory = await SubCategory.findOne({ _id: subCategory });

    if (!isExsitSubCategory) {
      return errorResponse(res, 404, "subCategory is not found !!!");
    }

    let images = [];

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];

      if (!supportedFormat.includes(file.mimetype)) {
        return errorResponse(
          res,
          400,
          "The format of this images is in correct",
          {
            supportedFormat,
          }
        );
      }

      let image = {
        filename: file.filename,
        path: `/images/products/${file.filename}`,
      };

      images.push(image);
    }

    let shortIdentifier = "";

    while (!shortIdentifier) {
      shortIdentifier = nanoid(6);

      const product = await Product.findOne({ slug: shortIdentifier });

      if (product) shortIdentifier = "";
    }

    const newProduct = await Product.create({
      customFilters,
      description,
      filterValues,
      images,
      name,
      sellers,
      shortIdentifier,
      slug,
      subCategory,
    });

    return successResponse(res, 201, {
      message: "Product created successfully :)",
      product: newProduct,
    });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 422, "Please send valid id !!!");
    }
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

exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 422, "Please send valid id !!!");
    }
  } catch (error) {
    next(error);
  }
};
