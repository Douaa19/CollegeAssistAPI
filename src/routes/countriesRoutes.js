const express = require("express");
const router = express.Router();

// authorization
const { authorization, authorizationRole } = require("../middlewares");

// controllers
const { Country } = require("../controllers");

// create country
router
  .route("/create-country")
  .post(
    authorization,
    authorizationRole("super-admin", "manager"),
    Country.createCountry
  );

// delete country
router
  .route("/delete-country/:country_id")
  .post(
    authorization,
    authorizationRole("super-admin", "manager"),
    Country.deleteCountry
  );

module.exports = router;
