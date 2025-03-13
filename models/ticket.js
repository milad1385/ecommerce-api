const mongoose = require("mongoose");

const replyTicketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    isAnswer: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: mongoose.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    subDepartment: {
      type: mongoose.Types.ObjectId,
      ref: "SubDepartment",
      required: true,
    },
    periority: {
      type: Number,
      enum: [1, 2, 3],
      default: 1,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "ANSWERED", "CLOSED"],
      default: "PENDING",
    },
    replies: {
      type: [replyTicketSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);
