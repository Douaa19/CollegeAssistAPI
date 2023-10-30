const { Course, Tutorial } = require("../models");
const path = require("path");
const fs = require("fs");

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
      const tutorials = await Tutorial.find({ course_id: course._id });
      if (tutorials.length > 0) {
        let tutorialsCourse = [];
        for (let i = 0; i < tutorials.length; i++) {
          tutorialsCourse.push(tutorials[i]);
        }
        res.status(200).send({ course, tutorials: tutorialsCourse });
      }
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// get course's image
const getImage = async (req, res) => {
  try {
    await Course.findOne({ image_course: req.params.image_name })
      .exec()
      .then((result) => {
        res
          .status(200)
          .sendFile(
            path.join(
              path.dirname(__dirname),
              "public",
              "images",
              "courses",
              result.image_course
            )
          );
      });
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
    // delete attachments of tutorials
    const tutorials = await Tutorial.find({ course_id });

    for (i = 0; i < tutorials.length; i++) {
      fs.unlink(
        path.join(
          path.dirname(__dirname),
          "public",
          "tutorials",
          tutorials[i].attachment
        ),
        (err) => {
          if (err) {
            console.log(err);
            return;
          }
        }
      );
    }
    // delete all tutorials related with this course
    const deletedTutorials = await Tutorial.deleteMany({ course_id });

    if (deletedTutorials) {
      const course = await Course.findByIdAndDelete(course_id);
      if (course) {
        fs.unlink(
          path.join(
            path.dirname(__dirname),
            "public",
            "images",
            "courses",
            course.image_course
          ),
          (err) => {
            if (err) {
              console.log(err);
              return;
            }
            res
              .status(200)
              .send({ messageSuccess: "Course deleted successfully" });
          }
        );
      }
    } else {
      res.status(400).send({ messageError: "Tutorials did not deleted" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  createCourse,
  getCourse,
  getImage,
  getCourses,
  updateCourse,
  deleteCourse,
};
