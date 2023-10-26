const { Course, Tutorial } = require("../models");

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
        res.status(200).send({ messageSuccess: "Course registred", newCourse });
      } else {
        res.status(400).send({ messageError: "Course not registred" });
      }
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// get course
const getCourse = async (req, res) => {
  try {
    const { course_id } = req.params;
    const course = await Course.findById(course_id);

    if (!course) {
      res.status(404).send({ messageError: "Course not found" });
    } else {
      res.status(200).send(course);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// get courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();

    if (courses.length > 0) {
      res.status(200).send(courses);
    } else {
      res.status(404).send({ messageError: "Courses not found" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// update course
const updateCourse = async (req, res) => {};

// delete course
const deleteCourse = async (req, res) => {
  try {
    const { course_id } = req.params;
    // delete all tutorials related with this course
    // const tutorials = await Tut({ course_id });
    if (tutorials.length > 0) {
      
    }
    const course = await Course.findById(course_id);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

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
