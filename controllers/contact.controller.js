const { errorResponse, successResponse } = require("../helpers/responses");
const nodemailer = require("nodemailer");
const Contact = require("../models/contactus");
const {
  createContactValidator,
  updateContactValidator,
} = require("../validators/contact.validator");
const { createPagination } = require("../utils/pagination");
const { isValidObjectId } = require("mongoose");

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
    const { id } = req.params;

    const { status, body, email } = req.body;

    await updateContactValidator.validate(req.body, { abortEarly: false });

    if (!isValidObjectId(id)) {
      return errorResponse(res, 400, "Please send valid id !!!");
    }

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODE_MAILER_AUTH_EMAIl,
        pass: process.env.NODE_MAILER_AUTH_PASS,
      },
    });

    const mailOptions = {
      from: process.env.NODE_MAILER_EMAIL,
      to: email,
      subject: "پشتیبانی سایت",
      text: body,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        return errorResponse(res, 400, "send mail faild !!!");
      } else {
        const updatedContact = await Contact.findByIdAndUpdate(
          id,
          {
            status,
          },
          { new: true }
        );

        return successResponse(res, 200, {
          message: `Contact ${status} successfully :)`,
          contact: updatedContact,
        });
      }
    });
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
