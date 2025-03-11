const { isValidObjectId } = require("mongoose");
const { successResponse, errorResponse } = require("../helpers/responses");
const Order = require("../models/order");
const { createPagination } = require("../utils/pagination");
const { updateOrderValidator } = require("../validators/order.validator");

exports.getAllUserOrder = async (req, res, next) => {
  try {
    const user = req.user;

    const { status = "all", page = 1, limit = 10 } = req.query;

    const filters = { user: user._id };

    if (status !== "all") {
      filters.status = status;
    }

    const orders = await Order.find(filters)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("user" , "-addresses")
      .populate("items.product")
      .populate("items.seller");

    const totalUserOrdersCount = await Order.countDocuments(filters);

    return successResponse(res, 200, {
      orders,
      pagination: createPagination(page, limit, totalUserOrdersCount, "Orders"),
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const { status = "all", page = 1, limit = 10 } = req.query;

    const filters = {};

    if (status !== "all") {
      filters.status = status;
    }

    const orders = await Order.find(filters)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("user" , "-addresses")
      .populate("items.product")
      .populate("items.seller");

    const totalOrdersCount = await Order.countDocuments(filters);

    return successResponse(res, 200, {
      orders,
      pagination: createPagination(page, limit, totalOrdersCount, "Orders"),
    });
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status, postTrackingCode } = req.body;

    if (!isValidObjectId(orderId)) {
      return errorResponse(res, 400, "Please send valid id !!!");
    }

    await updateOrderValidator.validate(req.body, { abortEarly: false });

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: {
          postTrackingCode,
          status,
        },
      },
      { new: true }
    );

    return successResponse(res, 200, {
      message: `Post status change to ${status}`,
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};
