const mongoose = require("mongoose");

// Courses schema
const Courses = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    start_date: {
      type: String,
      required: false,
      default: null,
    },
    duration: {
      type: Number,
      required: false,
      default: null,
    },
    description: {
      type: String,
      required: false,
      default: null,
    },
    image_course: {
      type: String,
      required: false,
      default: null,
    },
    country_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: false,
      default: null,
    },
    price: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", Courses);

module.exports = Course;
