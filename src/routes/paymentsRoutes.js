const express = require("express");
const router = express.Router();

// authorization
const { authorization, authorizationRole } = require("../middlewares");

// controllers
const { Payments } = require("../controllers");

// get payment status
router
  .route("/status")
  .get(authorization, authorizationRole("student"), Payments.getPaymentStatus);

// edit payment
router
  .route("/edit/:payment_id")
  .post(authorization, authorizationRole("manager"), Payments.editPayment);

// get payment of student
router
  .route("/:student_id")
  .get(
    authorization,
    authorizationRole("manager"),
    Payments.getPaymentOfStudent
  );

module.exports = router;
