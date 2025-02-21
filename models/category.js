const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    parent: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    description: {
      type: String,
      trim: true,
    },
    icon: {
      type: {
        filename: { type: String, required: true, trim: true },
        path: { type: String, required: true, trim: true },
      },
    },

    filters: {
      type: [
        {
          name: {
            type: String,
            required: true,
            trim: true,
          },
          slug: {
            type: String,
            required: true,
            trim: true,
            unique: true,
          },
          type: {
            type: String,
            enum: ["selectbox", "radio", "checkbox"],
            required: true,
          },
          options: {
            type: [String],
            default: undefined,
            validate: {
              validator: (options) => Array.isArray(options),
            },
          },

          description: {
            type: String,
            trim: true,
          },

          min: {
            type: Number,
          },
          max: {
            type: Number,
          },
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", schema);
