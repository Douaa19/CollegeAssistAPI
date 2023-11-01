const { User, StudentsCourses } = require("../models");

// get pending students
const getPendingStudents = async (req, res) => {
  try {
    const pendingStudents = await User.find({
      role: "student",
      status: "pending",
    });
    if (pendingStudents.length > 0) {
      res.status(200).send(pendingStudents);
    } else {
      res.status(400).send({ messageError: "No pending students" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};
// 0656427600
// accept student
const acceptStudent = async (req, res) => {
  try {
    const { student_id } = req.params;
    const student = await User.findById(student_id);
    if (student) {
      student.status = "accepted";
      res.status(200).send({ messageSuccess: "Student accepted" });
    } else {
      res.status(400).send({ messageError: "Student not found" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// get my students
const getMyStudents = async (req, res) => {
  try {
    const myStudents = await User.find({
      manager_id: req.user.id,
      status: "accepted",
    });
    if (myStudents.length > 0) {
      res.status(200).send(myStudents);
    } else {
      res.status(400).send({ messageError: "Students not found" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// accept course request
const getCourseRequest = async (req, res) => {
  try {
    const pendingRequests = await StudentsCourses.find({
      status: "pending",
    }).populate("course_id student_id");
    if (pendingRequests.length > 0) {
      res.status(200).send(pendingRequests);
    } else {
      res.status(404).send({ messageError: "There are no pending requests!" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  getPendingStudents,
  acceptStudent,
  getMyStudents,
  getCourseRequest,
};
