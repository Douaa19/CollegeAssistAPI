const { User, StudentsCourses, Course, Email } = require("../models");
const nodemailer = require("nodemailer");
const courseExpiringEmail = require("../emails/CourseExpiring");

const addCourse = async (req, res) => {
  try {
    const { course_id } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).send({ messageError: "User not found" });
    } else {
      // if course expired
      const email = await Email.findOne({ title: "course expiring" });
      const course = await Course.findById(course_id);

      const parts = course.start_date.split("/");
      const reversedDate = parts.reverse().join("/");

      if (new Date(reversedDate) <= new Date()) {
        if (email && course) {
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
            to: user.email,
            subject: email.subject,
            html: courseExpiringEmail.courseExpiring(
              email.content,
              user,
              course
            ),
          };
          mailOprtions.headers = {
            "Content-Type": "text/html",
          };
          transporter.sendMail(mailOprtions, (error, info) => {
            if (error) {
              res.send(error);
            } else {
              console.log(`Email send to ${user.email}!`);
              res.send({ message: "Course expired!" });
            }
          });
        }
      } else {
        // add course
        const newRequest = await StudentsCourses.create({
          course_id,
          student_id: user._id,
        });
        if (newRequest) {
          res.status(200).send(newRequest);
        }
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

module.exports = {
  addCourse,
  getMyCourses,
  getStudentsOfCourse,
  getAdditionalCourses,
};
