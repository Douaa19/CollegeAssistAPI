const { Attendence, Course, Email, StudentsCourses } = require("../models");
const moment = require("moment");
const nodemailer = require("nodemailer");
const attendenceEmail = require("../emails/Attendence");

const addAttendece = async (req, res) => {
  try {
    const dateStr = new Date();
    const date = moment.utc(dateStr).format("DD/MM/YYYY");
    const course = await Course.findById(req.body.course_id);
    if (course) {
      // console.log(date.replace(/\./g, "/") <= course.start_date);
      if (date.replace(/\./g, "/") == course.start_date || date.replace(/\./g, "/") < course.start_date) {
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
            if (attendence.status !== "present") {
              const studentCourse = await StudentsCourses.findOne({
                student_id: attendence.student_id,
                course_id: attendence.course_id,
              }).populate(
                "student_id course_id",
                "firstName lastName email title"
              );
              const email = await Email.findOne({
                title: "attendence and absence",
              });
              if (email && studentCourse) {
                const transporter = nodemailer.createTransport({
                  host: "mail.smartpeddle.com",
                  port: 587,
                  tls: {
                    rejectUnauthorized: false,
                  },
                  auth: {
                    user: "collegeassist@smartpeddle.com",
                    pass: "CollegeAssist23159.",
                  },
                });
                const mailOprtions = {
                  from: '"College Assist" <collegeassist@smartpeddle.com>',
                  to: studentCourse.student_id.email,
                  subject: email.subject,
                  html: attendenceEmail.attendence(
                    email.content,
                    studentCourse.student_id,
                    studentCourse.course_id,
                    date
                  ),
                };
                mailOprtions.headers = {
                  "Content-Type": "text/html",
                };
                transporter.sendMail(mailOprtions, (error, info) => {
                  if (error) {
                    res.send(error);
                  } else {
                    console.log("Email send!");
                  }
                });
              }
            }
            res.status(200).send(newAttendence);
          } else {
            res.status(400).send({ messageError: "Attendece doesn't created" });
          }
        }
      } else {
        res.send({
          messageError:
            "You cannot create attendece. This course is not started yet!",
        });
      }
    } else {
      res.status(404).send({ MessageError: "Course not found!" });
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
