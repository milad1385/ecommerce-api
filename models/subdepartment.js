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

const model = mongoose.model("SubDepartment", schema);

export default model;
