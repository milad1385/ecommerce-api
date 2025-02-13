const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model("Ban", schema);
