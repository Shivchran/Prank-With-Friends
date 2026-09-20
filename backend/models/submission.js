const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    yourName: {
      type: String,
      required: true,
      trim: true,
    },

    crushName: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      default: "love-calculator",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Submission",
  submissionSchema
);