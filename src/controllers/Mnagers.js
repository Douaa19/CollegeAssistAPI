const { User, StudentsCourses, Payment, Email } = require("../models");
const nodemailer = require("nodemailer");
const invoiceUnpaidEmail = require("../emails/InvoiceUnpaid");

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

// accept pending course request
const acceptCourseRequest = async (req, res) => {
  try {
    const courseRequest = await StudentsCourses.findById(
      req.params.id
    ).populate("course_id student_id");
    if (courseRequest && courseRequest.status === "pending") {
      courseRequest.status = "accepted";
      courseRequest.save();

      // create payment
      const payment = await Payment.create({
        course_id: courseRequest.course_id._id,
        student_id: courseRequest.student_id._id,
        status: 0,
        given_price: 0,
      });
      if (payment) {
        console.log("Payment created");

        //
        setTimeout(async () => {
          // get payment
          const myPayment = await Payment.findById(payment._id).populate(
            "student_id course_id",
            "firstName lastName email title price"
          );

          if (myPayment.status < 100) {
            const email = await Email.findOne({ title: "invoice unpaid" });

            //
            const remaining_amount =
              myPayment.course_id.price - myPayment.given_price;

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
              const mailOprtions = {
                from: '"College Assist" <collegeassist@smartpeddle.com>',
                to: myPayment.student_id.email,
                subject: email.subject,
                html: invoiceUnpaidEmail.invoiceUnpaid(
                  email.content,
                  myPayment.student_id,
                  myPayment.course_id,
                  myPayment,
                  remaining_amount
                ),
              };
              mailOprtions.headers = {
                "Content-Type": "text/html",
              };
              transporter.sendMail(mailOprtions, (error, info) => {
                if (error) {
                  res.send(error);
                } else {
                  console.log(`Email send to ${myPayment.student_id.email}!`);
                }
              });
            }
          }
        },7 * 24 * 60 * 60 * 1000);
      } else {
        console.log("Payment doesn't created");
      }
      res.status(200).send({
        messageSuccess: "Request accepted.",
        course: courseRequest,
      });
    } else {
      res.status(404).send({ messageError: "Request doesn't found" });
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
  acceptCourseRequest,
};
