const mongoose = require("mongoose");

// Application deadlines schema
const ApplicationDeadlines = new mongoose.Schema(
  {
    month: {
      type: String,
      required: false,
      default: null,
    },
    year: {
      type: String,
      required: false,
      default: null,
    },
    decisions: [
      {
        type: String,
        required: false,
        default: null,
      },
    ],
    university_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ApplicationDeadline = mongoose.model(
  "ApplicationDeadline",
  ApplicationDeadlines
);

module.exports = ApplicationDeadline;
