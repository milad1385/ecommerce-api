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
