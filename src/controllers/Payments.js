const { Payment, Email } = require("../models");
const nodemailer = require("nodemailer");
const invoicePaidEmail = require("../emails/InvoicePaid");

const getPaymentStatus = async (req, res) => {
  try {
    const student_id = req.user.id;
    const payment = await Payment.findOne({ student_id }).populate(
      "student_id course_id",
      "_id title price"
    );

    if (payment) {
      res.status(200).send(payment);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const editPayment = async (req, res) => {
  try {
    const { payment_id } = req.params;
    const payment = await Payment.findById(payment_id).populate(
      "student_id course_id",
      "firstName lastName email title price"
    );
    if (payment) {
      payment.given_price += parseInt(req.body.price);
      payment.status = (payment.given_price / payment.course_id.price) * 100;
      payment.save();

      //
      const email = await Email.findOne({ title: "invoice paid" });

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
          to: payment.student_id.email,
          subject: email.subject,
          html: invoicePaidEmail.invoicePaid(
            email.content,
            payment.student_id,
            payment.course_id,
            payment
          ),
        };
        mailOprtions.headers = {
          "Content-Type": "text/html",
        };
        transporter.sendMail(mailOprtions, (error, info) => {
          if (error) {
            res.send(error);
          } else {
            console.log(`Email send to ${payment.student_id.email}!`);
          }
        });
      }

      res
        .status(200)
        .send({ messageSuccess: "Givin price updated successfully!", payment });
    } else {
      res.status(400).send({ messageError: "Payment not found" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getPaymentOfStudent = async (req, res) => {
  try {
    const { student_id } = req.params;
    const payment = await Payment.findOne({ student_id }).populate(
      "student_id course_id",
      "_id title price"
    );

    if (payment) {
      res.status(200).send(payment);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  getPaymentStatus,
  editPayment,
  getPaymentOfStudent,
};
