const mongoose = require("mongoose");

// Users schema
const StudentsCourses = new mongoose.Schema(
  {
    course_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: false,
        default: null,
      },
    ],
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const StudentsCourse = mongoose.model("StudentsCourse", StudentsCourses);

module.exports = StudentsCourse;
