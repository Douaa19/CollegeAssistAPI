const { User } = require("../models");

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

// accept student
const acceptStudent = async (req, res) => {
  try {
    const { student_id } = req.params;
    const student = await User.findById(student_id);
    if (student) {
      student.status = "accepted";
      student.manager_id = req.user.id;
      student.save();
      res.status(200).send({ messageSuccess: "Student accepted" });
    } else {
      res.status(400).send({ messageError: "Student not found" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  getPendingStudents,
  acceptStudent,
};
