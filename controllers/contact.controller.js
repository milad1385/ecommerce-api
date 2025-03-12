const { errorResponse, successResponse } = require("../helpers/responses");
const nodemailer = require("nodemailer");
const Contact = require("../models/contactus");
const { createContactValidator } = require("../validators/contact.validator");
const { createPagination } = require("../utils/pagination");

exports.getAllContacts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status = "all" } = req.query;

    const filters = {};

    if (status !== "all") {
      filters.status = status;
    }

    const contacts = await Contact.find(filters)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({
        createdAt: -1,
      });

    const contactsCount = await Contact.countDocuments(filters);

    return successResponse(res, 200, {
      contacts,
      pagination: createPagination(page, limit, contactsCount, "Contacts"),
    });
  } catch (error) {
    next(error);
  }
};

exports.createContact = async (req, res, next) => {
  try {
    const { email, content, phone } = req.body;

    await createContactValidator.validate(req.body, { abortEarly: false });

    const newContact = await Contact.create({
      content,
      email,
      phone,
    });

    return successResponse(res, 201, {
      message: "contact created successfully :)",
      contact: newContact,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateContact = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.deleteContact = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
