import mongoose from "mongoose";
import Department from "./department";
const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    department: {
      type: mongoose.Types.ObjectId,
      ref: "Department",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubDepartment", schema);
