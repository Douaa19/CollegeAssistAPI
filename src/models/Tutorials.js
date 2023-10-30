const mongoose = require("mongoose");

// Tutorials schema
const Tutorials = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    attachment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Tutorial = mongoose.model("Tutorial", Tutorials);

module.exports = Tutorial;
