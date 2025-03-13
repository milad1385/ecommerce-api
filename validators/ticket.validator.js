const { isValidObjectId } = require("mongoose");
const yup = require("yup");

exports.createTicketValidator = yup.object({
  title: yup.string().required("title is required !!!"),
  content: yup.string().required("content is required !!!"),
  department: yup
    .string()
    .required("department is required !!!")
    .test("is-valid-object-id", "Invalid department ID", (value) =>
      isValidObjectId(value)
    ),
  subDepartment: yup
    .string()
    .required("sub department is required !!!")
    .test("is-valid-object-id", "Invalid sub department ID", (value) =>
      isValidObjectId(value)
    ),
});
