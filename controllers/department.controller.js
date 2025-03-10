const { successResponse } = require("../helpers/responses");
const Department = require("../models/department");
const SubDepartment = require("../models/subdepartment");

exports.getAllDepartment = async (req, res, next) => {
  try {
    const departments = await Department.find({});

    return successResponse(res, 200, { departments });
  } catch (error) {
    next(error);
  }
};

exports.createDepartment = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.deleteDepartment = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.updateDepartment = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.getAllSubDepartment = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
