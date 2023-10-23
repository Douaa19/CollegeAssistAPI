const { Course } = require("../models");

// create course
const createCourse = async (req, res) => {
  try {
    const data = [
      req.body.title,
      req.body.start_date,
      req.body.duration,
      req.body.description,
      req.body.country_id,
    ];
    const image = req.file.filename;

    const courseExists = await Course.find({ title: data[0] });
    if (courseExists.length > 0) {
      res.status(400).send({ messageError: "This course is already here!" });
    } else {
      const newCourse = await Course.create({
        title: data[0],
        start_date: data[1],
        duration: data[2],
        description: data[3],
        image_course: image,
        country_id: data[4],
      });
      if (newCourse) {
        res.status(200).send({ messageSuccess: "Course registred" });
      } else {
        res.status(400).send({ messageError: "Course not registred" });
      }
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// get course
const getCourse = async (req, res) => {};

// get courses
const getCourses = async (req, res) => {};

// update course
const updateCourse = async (req, res) => {};

// delete course
const deleteCourse = async (req, res) => {};

// get course by tutorial
const getCourseByTutorial = async (req, res) => {};

module.exports = {
  createCourse,
  getCourse,
  getCourses,
  updateCourse,
  deleteCourse,
  getCourseByTutorial,
};
