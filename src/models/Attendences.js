const mongoose = require("mongoose");

// Attendences schema
const Attendences = new mongoose.Schema(
  {
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: false,
      default: null,
    },
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },
    status: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Attendence = mongoose.model("Attendence", Attendences);

module.exports = Attendence;
