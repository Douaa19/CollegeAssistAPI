const mongoose = require("mongoose");

// AdditionalCourses schema
const AdditionalCourses = new mongoose.Schema(
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
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const AdditionalCourse = mongoose.model("AdditionalCourse", AdditionalCourses);

module.exports = AdditionalCourse;
