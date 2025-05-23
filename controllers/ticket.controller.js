const Ticket = require("../models/ticket");
const Department = require("../models/department");
const SubDepartment = require("../models/subdepartment");
const { successResponse, errorResponse } = require("../helpers/responses");
const { createPagination } = require("../utils/pagination");
const {
  createTicketValidator,
  sendAnswerToTicketValidator,
  changeTicketStatusValidator,
} = require("../validators/ticket.validator");
const { isValidObjectId } = require("mongoose");

exports.getAllUserTickets = async (req, res, next) => {
  try {
    const user = req.user;

    const { page = 1, limit = 10, status = "all" } = req.query;

    const filters = {
      user: user._id,
    };

    if (status !== "all") {
      filters.status = status;
    }

    const tickets = await Ticket.find(filters)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("user department subDepartment replies.user", "-addresses")
      .sort({ createdAt: -1 });

    const totalTicketsCount = await Ticket.countDocuments(filters);

    return successResponse(res, 200, {
      tickets,
      pagination: createPagination(page, limit, totalTicketsCount, "Tickets"),
    });
  } catch (error) {
    next(error);
  }
};

exports.createTicket = async (req, res, next) => {
  try {
    const user = req.user;

    const { title, content, departmentId, subDepartmentId, periority } =
      req.body;

    await createTicketValidator.validate(req.body, { abortEarly: false });

    const isExistDepartment = await Department.findOne({ _id: departmentId });

    if (!isExistDepartment) {
      return errorResponse(res, 404, "Department is not found !!!");
    }

    const isExistSubDepartment = await SubDepartment.findOne({
      _id: subDepartmentId,
    });

    if (!isExistSubDepartment) {
      return errorResponse(res, 404, "Sub Department is not found !!!");
    }

    const newTicket = await Ticket.create({
      title,
      content,
      user: user._id,
      department: departmentId,
      subDepartment: subDepartmentId,
      periority,
    });

    return successResponse(res, 201, {
      message: "Ticket created successfully :)",
      ticket: newTicket,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllTickets = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status = "all" } = req.query;

    const filters = {};

    if (status !== "all") {
      filters.status = status;
    }

    const tickets = await Ticket.find(filters)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("user department subDepartment", "-addresses")
      .sort({ createdAt: -1 });

    const totalTicketsCount = await Ticket.countDocuments(filters);

    return successResponse(res, 200, {
      tickets,
      pagination: createPagination(page, limit, totalTicketsCount, "Tickets"),
    });
  } catch (error) {
    next(error);
  }
};

exports.sendAnswerToTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content, isAnswer } = req.body;

    if (isValidObjectId(id)) {
      return errorResponse(res, 400, "Please send valid id !!");
    }

    await sendAnswerToTicketValidator.validate(req.body, { abortEarly: false });

    const answerObject = {
      user: user._id,
      isAnswer,
      content,
    };

    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      {
        $push: {
          replies: answerObject,
        },
      },
      { new: true }
    );

    return successResponse(res, 200, {
      message: "Answer send successfully :)",
      ticket: updatedTicket,
    });
  } catch (error) {
    next(error);
  }
};

exports.changeTicketStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (isValidObjectId(id)) {
      return errorResponse(res, 400, "Please send valid id !!");
    }

    await changeTicketStatusValidator.validate(req.body, { abortEarly: false });

    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedTicket) {
      return errorResponse(res, 404, "Ticket is not found !!!");
    }

    return successResponse(res, 200, {
      message: `status changed to ${status}`,
      ticket: updatedTicket,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteTicket = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isValidObjectId(id)) {
      return errorResponse(res, 400, "Please send valid id !!");
    }

    const deletedTicket = await Ticket.findByIdAndDelete(id);

    if (!deletedTicket) {
      return errorResponse(res, 404, "Ticket is not found !!!");
    }
    

    return successResponse(res, 200, {
      message: "Ticket deleted successfully :)",
      ticket: deletedTicket,
    });
  } catch (error) {
    next(error);
  }
};
