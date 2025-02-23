const { isValidObjectId } = require("mongoose");
const { errorResponse, successResponse } = require("../helpers/responses");
const {
  categoryValidator,
  categoryEditValidator,
} = require("../validators/category.validator");
const Category = require("../models/category");
const SubCategory = require("../models/subCategory");

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

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 422, "Please send valid id !!!");
    }

    const deletedCatgory = await Category.findByIdAndDelete(id);

    if (!deletedCatgory) {
      return errorResponse(res, 404, "Category  not found !!!");
    }

    return successResponse(res, 200, {
      message: "Category deleted successfuly :)",
      category: deletedCatgory,
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
    filters = JSON.parse(filters);

    await categoryEditValidator.validate(
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

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        title,
        slug,
        parent,
        description,
        filters,
        icon,
      },
      { new: true }
    );

    if (!updatedCategory) {
      return errorResponse(res, 404, "Category not found !!");
    }

    return successResponse(res, 200, {
      message: "Category updated successfully :)",
      category: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

exports.fetchAll = async (req, res, next) => {
  try {
    const fetchSubcategoriesRecursively = async (parentId = null) => {
      const subCategories = await SubCategory.find({ parent: parentId });
      const parentSubCategories = await Category.find({
        parent: parentId,
      }).lean();

      const fetchedParentSubCategories = [];

      for (const category of parentSubCategories) {
        category.subCategories = await fetchSubcategoriesRecursively(
          category._id
        );

        fetchedParentSubCategories.push(category);
      }

      return [...fetchedParentSubCategories, ...subCategories];
    };

    const categories = await fetchSubcategoriesRecursively(null);

    return successResponse(res, 200, { categories });
  } catch (err) {
    next(err);
  }
};
