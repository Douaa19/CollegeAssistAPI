const { Course, Tutorial, Email, StudentsCourses } = require("../models");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
const schedule = require("node-schedule");
const courseUpdates = require("../emails/CouseUpdates");
const deadlinesEmail = require("../emails/Deadlines");

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

        const dateParts = newCourse.start_date.split("/");
        const parsedStartDate = new Date(
          `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
        );

        // deadline email
        const scheduledTime = new Date(parsedStartDate);
        scheduledTime.setDate(scheduledTime.getDate() - 1);
        scheduledTime.setHours(9, 0, 0, 0);

        schedule.scheduleJob(scheduledTime, async () => {
          const studentsCourse = await StudentsCourses.find({
            course_id: newCourse._id,
          }).populate(
            "student_id course_id",
            "firstName lastName email title start_date"
          );

          // get deadline email
          const email = await Email.findOne({ title: "deadlines" });

          if (email && studentsCourse.length > 0) {
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
            for (const studentCourse of studentsCourse) {
              const mailOprtions = {
                from: '"College Assist" <collegeassist@smartpeddle.com>',
                to: studentCourse.student_id.email,
                subject: email.subject,
                html: deadlinesEmail.deadlines(
                  email.content,
                  studentCourse.student_id,
                  studentCourse.course_id
                ),
              };
              mailOprtions.headers = {
                "Content-Type": "text/html",
              };
              try {
                await transporter.sendMail(mailOprtions);
                console.log(
                  `Deadline email sent to ${studentCourse.student_id.email}`
                );
              } catch (error) {
                console.error(
                  `Error sending email to ${studentCourse.student_id.firstName} ${student.student_id.lastName}:`,
                  error
                );
              }
            }
          }
          console.log(
            `Deadline emails scheduled to be sent at: ${scheduledTime}`
          );
        });
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
      } else {
        res.status(200).send({ course });
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
const editCourse = async (req, res) => {
  try {
    const path = "src\\public\\images\\courses\\";
    const { course_id } = req.params;
    const course = await Course.findById(course_id);
    if (course) {
      if (req.file.filename) {
        fs.unlink(`${path}${course.image_course}`, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Image deleted successfully!");
          }
        });
      }

      const newData = {
        title: req.body.title,
        start_date: req.body.start_date,
        duration: req.body.duration,
        description: req.body.description,
        country_id: req.body.country_id,
        title: req.body.title,
        image_course: req.file.filename,
      };

      const courseExists = await Course.find({
        title: req.body.title,
      });

      if (courseExists.length > 0) {
        res
          .status(400)
          .send({ messageError: "This title is already exists", courseExists });
      } else {
        await Course.findByIdAndUpdate(course_id, newData).then(
          async (result) => {
            if (result) {
              const students = await StudentsCourses.find({
                course_id: course_id,
              }).populate("student_id", "email firstNmae lastName");
              const email = await Email.findOne({
                title: "course updates",
              });
              if (email) {
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
                for (const student of students) {
                  const mailOprtions = {
                    from: '"College Assist" <collegeassist@smartpeddle.com>',
                    to: student.student_id.email,
                    subject: email.subject,
                    html: courseUpdates.courseUpdates(email.content, result),
                  };
                  mailOprtions.headers = {
                    "Content-Type": "text/html",
                  };
                  try {
                    await transporter.sendMail(mailOprtions);
                    console.log(
                      `Course update email sent to ${student.student_id.email}`
                    );
                  } catch (error) {
                    console.error(
                      `Error sending email to ${student.student_id.firstName} ${student.student_id.lastName}:`,
                      error
                    );
                  }
                }
              } else {
                console.log("Email content not found");
              }
              res.status(200).send({
                messageSuccess: "Course updated successfully!",
                result,
              });
            } else {
              res.status(400).send({ messageError: "Course doesn't updated!" });
            }
          }
        );
      }
    } else {
      res.status(404).send({ messageError: "Cours doesn't found" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

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
  editCourse,
  deleteCourse,
};
