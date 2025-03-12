const { errorResponse, successResponse } = require("../helpers/responses");
const Contact = require("../models/contactus");

const nodemailer = require("nodemailer");
const { createContactValidator } = require("../validators/contact.validator");

exports.getAllContacts = async (req, res, next) => {
  try {
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
