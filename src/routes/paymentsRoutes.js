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

module.exports = router;
