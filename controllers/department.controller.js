const { isValidObjectId } = require("mongoose");
const { successResponse, errorResponse } = require("../helpers/responses");
const Department = require("../models/department");
const SubDepartment = require("../models/subdepartment");
const {
  createDepartmentValidator,
  updateDepartmentValidator,
} = require("../validators/department.validator");

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
    const { title } = req.body;

    await createDepartmentValidator.validate(req.body, { abortEarly: false });

    const newDepartment = await Department.create({
      title,
    });

    return successResponse(res, 201, {
      message: "Department created successfully:)",
      department: newDepartment,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 400, "Please send valid id !!!");
    }

    const deletedDepartment = await Department.findByIdAndDelete(id);

    if (!deletedDepartment) {
      return errorResponse(res, 404, "Department is not found !!!");
    }

    return successResponse(res, 200, {
      message: "Department deleted successfully :)",
      department: deletedDepartment,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { title } = req.body;

    await updateDepartmentValidator.validate(req.body, { abortEarly: false });

    if (!isValidObjectId(id)) {
      return errorResponse(res, 400, "Please send valid id !!!");
    }

    const updatedDepartment = await Department.findByIdAndUpdate(id, {
      title,
    });

    if (!updatedDepartment) {
      return errorResponse(res, 404, "Department is not found !!!");
    }

    return successResponse(res, 200, {
      message: "Department updated successfully :)",
      department: updatedDepartment,
    });
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
