const { User, StudentsCourses, Course } = require("../models");

const addCourse = async (req, res) => {
  try {
    const { course_id } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).send({ messageError: "User not found" });
    } else {
      const newRequest = await StudentsCourses.create({
        course_id,
        student_id: user._id,
      });
      if (newRequest) {
        res.status(200).send(newRequest);
      }
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getMyCourses = async (req, res) => {
  try {
    const myCourses = await StudentsCourses.find({
      student_id: req.user.id,
    }).populate("course_id");
    if (myCourses) {
      res.status(200).send(myCourses);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getStudentsOfCourse = async (req, res) => {
  try {
    const { course_id } = req.params;
    const myStudents = await StudentsCourses.find({ course_id }).populate(
      "student_id"
    );
    if (myStudents.length > 0) {
      res.send(myStudents);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getAdditionalCourses = async (req, res) => {
  try {
    const myCourses = await StudentsCourses.find({ student_id: req.user.id });
    if (myCourses.length > 0) {
      const myCourseIds = myCourses.map((myCourse) => myCourse.course_id);

      const additionalCourses = await Course.find({
        _id: { $nin: myCourseIds },
      });

      res.status(200).send(additionalCourses);
    } else {
      const courses = await Course.find();
      if (courses.lenght > 0) res.status(200).send(courses);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const createAdditionaleCourse = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  addCourse,
  getMyCourses,
  getStudentsOfCourse,
  getAdditionalCourses,
  createAdditionaleCourse,
};
