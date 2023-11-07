const { Payment } = require("../models");

const getPaymentStatus = async (req, res) => {
  try {
    const student_id = req.user.id;
    const payment = await Payment.findOne({ student_id }).populate(
      "student_id course_id"
    );

    if (payment) {
      const percentage = (payment.given_price / payment.course_id.price) * 100;
      payment.status = `${Math.round(percentage)}%`;
      payment.save();
      res.status(200).send(`${payment.status}`);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { getPaymentStatus };
