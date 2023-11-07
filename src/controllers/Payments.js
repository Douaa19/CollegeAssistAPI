const { Payment } = require("../models");

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
      "_id title price firstName lastName"
    );
    if (payment) {
      payment.given_price += parseInt(req.body.price);
      payment.status = (payment.given_price / payment.course_id.price) * 100;
      payment.save();

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
