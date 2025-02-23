const { isValidObjectId } = require("mongoose");
const { errorResponse, successResponse } = require("../helpers/responses");
const { subCategoryValidator } = require("../validators/category.validator");
const Category = require("../models/category");
const SubCategory = require("../models/subCategory");

exports.create = async (req, res, next) => {
  try {
    let { title, slug, parent, description, filters } = req.body;

    await subCategoryValidator.validate(req.body, { abortEarly: false });

    const isExistParent = await Category.findOne({ _id: parent });

    if (!isExistParent) {
      return errorResponse(
        res,
        404,
        "The Parent of this subCategory not found !!!"
      );
    }

    const subCategory = await SubCategory.create({
      description,
      filters,
      parent,
      slug,
      title,
    });

    return successResponse(res, 201, {
      message: "subCategory created successfully :)",
      subCategory,
    });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 422, "PLease send valid id !!!");
    }

    const deletedSubCategory = await SubCategory.findByIdAndDelete(id);

    if (!deletedSubCategory) {
      return errorResponse(res, 404, "subCategory not found !!!");
    }

    return successResponse(res, 200, {
      message: "subCategory deleted successfully :)",
      subCategory: deletedSubCategory,
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

    let { title, slug, parent, description, filters } = req.body;

    await subCategoryValidator.validate(req.body, { abortEarly: false });

    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      id,
      {
        title,
        slug,
        parent,
        description,
        filters,
      },
      { new: true }
    );

    if (!updatedSubCategory) {
      return errorResponse(res, 404, "subCategory not found !!");
    }

    return successResponse(res, 200, {
      message: "Category updated successfully :)",
      category: updatedSubCategory,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const subCategories = await SubCategory.find({});

    return successResponse(res, 200, { subCategories });
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
