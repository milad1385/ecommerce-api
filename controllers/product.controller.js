const { isValidObjectId, default: mongoose } = require("mongoose");
const { errorResponse, successResponse } = require("../helpers/responses");
const SubCategory = require("../models/subCategory");
const {
  createProductValidator,
  updateProductValidator,
} = require("../validators/product.validator");
const { nanoid } = require("nanoid");
const Product = require("../models/product");
const Bookmark = require("../models/bookmark");
const WishList = require("../models/wish");
const Note = require("../models/note");
const fs = require("fs");
const { createPagination } = require("../utils/pagination");

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

    const isExistSubCategory = await SubCategory.findOne({ _id: subCategory });

    if (!isExistSubCategory) {
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

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return errorResponse(res, 404, "the product not found !!!");
    }

    deletedProduct?.images?.forEach((image) =>
      fs.unlink(`public/images/products/${image.filename}`, (err) => next(err))
    );

    await Note.deleteMany({ product: deletedProduct._id });

    await Bookmark.deleteMany({ product: deletedProduct._id });
    await WishList.deleteMany({ product: deletedProduct._id });

    return successResponse(res, 200, {
      message: "Product deleted successfully :)",
      product: deletedProduct,
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

    const product = await Product.findOne({ _id: id });

    if (!product) {
      return errorResponse(res, 404, "Product not found !!!");
    }

    let { name, slug, description, subCategory, filterValues, customFilters } =
      req.body;

    filterValues = JSON.parse(filterValues || {});
    customFilters = JSON.parse(customFilters || {});

    await updateProductValidator.validate(
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

    let images = [];

    if (req.files.length) {
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
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        slug,
        sellers,
        description,
        subCategory,
        filterValues,
        customFilters,
        images: images.length ? images : product.images,
      },
      { new: true }
    );

    return successResponse(res, 200, {
      message: "Product updated successfully :)",
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = req.user;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 422, "Please send valid id !!!");
    }

    const product = await Product.findOne({ _id: id }).populate(
      "subCategory sellers.seller"
    );

    if (!product) {
      return errorResponse(res, 404, "Product not found !!!");
    }

    if (user) {
      const bookmark = await Bookmark.findOne({
        user: user._id,
        product: product._id,
      });
      const wish = await WishList.findOne({
        user: user._id,
        product: product._id,
      });

      product.bookmark = bookmark ? true : false;
      product.wish = wish ? true : false;
    }

    
    return successResponse(res, 200, {
      product,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const {
      name,
      categoryId,
      minPrice,
      maxPrice,
      sellerId,
      page = 1,
      limit = 10,
      ...filterValues
    } = req.query;

    const user = req.user;

    const filters = await buildQuery(
      name,
      categoryId,
      minPrice,
      maxPrice,
      sellerId,
      filterValues
    );

    const products = await Product.aggregate([
      {
        $match: filters,
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "product",
          as: "comments",
        },
      },
      {
        $addFields: {
          ratingAvrage: {
            $cond: {
              if: { $gte: [{ $size: "$comments" }, 0] },
              then: { $avg: `$comments.rating` },
              else: 0,
            },
          },
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: +limit,
      },
    ]);

    if (user) {
      const bookmarks = await Bookmark.find({ user: user._id });
      const wishes = await WishList.find({ user: user._id });

      products.forEach((product) => {
        bookmarks.forEach((bookmark) => {
          if (product._id.toString() === bookmark.product.toString()) {
            product.bookmark = true;
          }
        });
      });

      products.forEach((product) => {
        wishes.forEach((wish) => {
          if (product._id.toString() === wish.product.toString()) {
            product.wish = true;
          }
        });
      });
    }

    const totalProducts = await Product.countDocuments(filters);

    return successResponse(res, 200, {
      products,
      pagination: await createPagination(
        page,
        limit,
        totalProducts,
        "Products"
      ),
    });
  } catch (error) {
    next(error);
  }
};

const buildQuery = async (
  name,
  categoryId,
  minPrice,
  maxPrice,
  sellerId,
  filterValues
) => {
  const filters = {
    "sellers.stock": { $gt: 0 },
  };

  if (name) {
    filters.name = { $regex: name, $options: "i" };
  }

  if (minPrice) {
    filters["sellers.price"] = { $gte: +minPrice };
  }

  if (maxPrice) {
    filters["sellers.price"] = { $lte: +maxPrice };
  }

  if (sellerId) {
    filters["sellers.seller"] =
      mongoose.Types.ObjectId.createFromHexString(sellerId);
  }

  if (filterValues) {
    Object.keys(filterValues).forEach((key) => {
      filters[`filterValues.${key}`] = filterValues[key];
    });
  }

  if (categoryId) {
    const categories = await SubCategory.find().populate("parent");

    const childCategories = [];
    for (const category of categories) {
      if (
        category.parent?._id.toString() === categoryId ||
        category.parent.parent?.toString() === categoryId ||
        category._id.toString() === categoryId
      ) {
        childCategories.push(category._id);
      }
    }

    filters.subCategory = { $in: childCategories };
  }

  return filters;
};
