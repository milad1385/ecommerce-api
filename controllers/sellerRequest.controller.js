const { errorResponse, successResponse } = require("../helpers/responses");
const SellerRequest = require("../models/sellerRequest");
const Seller = require("../models/seller");
const Product = require("../models/product");
const {
  createSellerRequestValidator,
  updateSellerRequestValidator,
} = require("../validators/sellerRequest.validator");
const { isValidObjectId } = require("mongoose");
const { createPagination } = require("../utils/pagination");

exports.getAllSellerRequest = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status = "pending" } = req.params;

    const user = req.user;

    const seller = await Seller.findOne({ user: user._id });

    if (!seller) {
      return errorResponse(res, 404, "Seller not found !!");
    }

    let filter = {
      seller: user._id,
      status,
    };

    const sellerRequestCount = await SellerRequest.countDocuments({
      seller: user._id,
    });

    const sellerRequests = await SellerRequest.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    return successResponse(res, 200, {
      sellerRequests,
      pagination: createPagination(
        page,
        limit,
        sellerRequestCount,
        "SellerRequests"
      ),
    });
  } catch (error) {
    next(error);
  }
};

exports.createSellerRequest = async (req, res, next) => {
  try {
    const { productId, price, stock, periority, discount } = req.body;

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
      status: { $in: ["accepted", "rejected"] },
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
      discount: discount <= 100 ? discount : 0,
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
    const { id } = req.params;

    const { adminComment, status } = req.body;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 422, "Please send valid id !!!");
    }

    await updateSellerRequestValidator.validate(req.body, {
      abortEarly: false,
    });

    const sellerRequest = await SellerRequest.findById(id);

    if (!sellerRequest) {
      return errorResponse(res, 404, "Seller request is not found !!!");
    }

    if (status === "reject") {
      sellerRequest.status = "rejected";

      if (adminComment) {
        sellerRequest.adminComment = adminComment;
      }
    } else {
      const product = await Product.findOne({ _id: sellerRequest._id });

      if (!product) {
        return errorResponse(res, 404, "Product not found !!!");
      }

      const isExistSeller = product.sellers.find(
        (selerItem) =>
          selerItem.seller.toString() === sellerRequest.seller.toString()
      );

      if (isExistSeller) {
        return errorResponse(res, 400, "This seller is already existed !!!");
      }

      if (adminComment) {
        sellerRequest.adminComment = adminComment;
      }

      product.sellers.push({
        discount: sellerRequest.discount,
        price: sellerRequest.price,
        seller: sellerRequest.seller,
        stock: sellerRequest.stock,
      });

      await product.save();

      sellerRequest.status = "accepted";

      await sellerRequest.save();

      return successResponse(res, 200, {
        message:
          "Seller request accepted successfully and seller added in product sellers",
        sellerRequest,
      });
    }
  } catch (error) {
    next(error);
  }
};
