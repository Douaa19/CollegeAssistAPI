const { Attendence } = require("../models");
const moment = require("moment");

const addAttendece = async (req, res) => {
  try {
    const dateStr = new Date();
    const date = moment.utc(dateStr).format("DD.MM.YYYY");
    const attendence = {
      student_id: req.body.student_id,
      course_id: req.body.course_id,
      status: req.body.status,
    };

    const attendenceExists = await Attendence.findOne({
      student_id: attendence.student_id,
      course_id: attendence.course_id,
    });
    if (attendenceExists && date == attendenceExists.date) {
      console.log(attendenceExists);
      attendenceExists.status = req.body.status;
      attendenceExists.save();
      res
        .status(200)
        .send({ messageSuccess: "Attendence updated", attendenceExists });
    } else {
      const newAttendence = await Attendence.create({
        student_id: attendence.student_id,
        course_id: attendence.course_id,
        status: attendence.status,
        date,
      });
      if (newAttendence) {
        res.status(200).send(newAttendence);
      } else {
        res.status(400).send({ messageError: "Attendece doesn't created" });
      }
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getStudentsScore = async (req, res) => {
  try {
    const { course_id } = req.params;
    const attendences = await Attendence.find({ course_id }).populate(
      "student_id course_id"
    );
    if (attendences.length > 0) {
      const scoreMap = {};

      attendences.forEach((attendence) => {
        const student_id = attendence.student_id;
        const status = attendence.status;

        if (!scoreMap[student_id._id]) {
          scoreMap[student_id._id] = {
            score: 0,
            firstName: student_id.fullName,
            lastName: student_id.lastName,
            email: student_id.email,
          };
        }

        if (status === "present") {
          scoreMap[student_id._id].score++;
        }

        // if (status === "present") {
        //   scoreMap[student_id._id].present++;
        // } else if (status === "absent") {
        //   scoreMap[student_id._id].absent++;
        // }
      });

      res.status(200).send({ scoreMap, attendences });
    } else {
      res
        .status(404)
        .json({ message: "No attendances found for this course." });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  addAttendece,
  getStudentsScore,
};
