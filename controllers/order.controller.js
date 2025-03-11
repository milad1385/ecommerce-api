const { successResponse } = require("../helpers/responses");
const Order = require("../models/order");
const { createPagination } = require("../utils/pagination");

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
      .sort({ createdAt: -1 });

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
      .sort({ createdAt: -1 });

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
  } catch (error) {
    next(error);
  }
};
