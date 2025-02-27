const { errorResponse, successResponse } = require("../helpers/responses");
const SellerRequest = require("../models/sellerRequest");
const Seller = require("../models/seller");
const Product = require("../models/product");
const {
  createSellerRequestValidator,
} = require("../validators/sellerRequest.validator");
const { isValidObjectId } = require("mongoose");

exports.getAllSellerRequest = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.createSellerRequest = async (req, res, next) => {
  try {
    const { productId, price, stock, periority } = req.body;

    const user = req.user;

    if (!isValidObjectId(productId)) {
      return errorResponse(res, 422, "Please send valid id !!!");
    }

    await createSellerRequestValidator.validate(req.body, {
      abortEarly: false,
    });

    const seller = await Seller.findOne({ _id: user._id });

    if (!seller) {
      return errorResponse(res, 404, "Seller not found !!!");
    }

    const product = await Product.findOne({ _id: productId });

    if (!product) {
      return errorResponse(res, 404, "This product not found !!!");
    }

    const existingSellerRequest = await SellerRequest.findOne({
      product: productId,
      seller: seller._id,
    });

    if (existingSellerRequest) {
      return errorResponse(
        res,
        400,
        "This request is already exist please wait for response !!!"
      );
    }

    const newSellerRequest = await SellerRequest.create({
      price,
      product: productId,
      seller: seller._id,
      stock,
      status: "pending",
      periority,
    });

    return successResponse(res, 201, {
      message: "Seller request sent successfully :)",
      sellerRequest: newSellerRequest,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteSellerRequest = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 422, "Please send valid id !!!");
    }

    const user = req.user;

    const sellerRequest = await SellerRequest.findOne({ _id: id });

    if (user._id.toString() !== sellerRequest.seller.toString()) {
      return errorResponse(
        res,
        403,
        "You can't delete some one else request !!!"
      );
    }

    if (sellerRequest.status !== "pending") {
      return errorResponse(
        res,
        403,
        "You can't delete accepted or rejected request !!!"
      );
    }

    const deletedRequest = await SellerRequest.findByIdAndDelete(id);

    return successResponse(res, 200, {
      message: "seller request deleted successfully :)",
      sellerRequest: deletedRequest,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateSellerRequest = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
