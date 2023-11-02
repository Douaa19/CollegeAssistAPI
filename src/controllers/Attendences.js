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

module.exports = {
  addAttendece,
};
