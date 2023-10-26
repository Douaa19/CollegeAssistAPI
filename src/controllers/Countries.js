const { Country } = require("../models");

// create country
const createCountry = async (req, res) => {
  try {
    const { name } = req.body;
    const countryExists = await Country.find({ name });
    if (countryExists.length > 0) {
      res.status(200).send({ messageError: "Country is already exists" });
    } else {
      const newCountry = await Country.create({ name: name });
      if (newCountry) {
        res.status(200).send({ messageSuccess: "Country created", newCountry });
      } else {
        res.status(400).send({ messageError: "Country not created" });
      }
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// delete country
const deleteCountry = async (req, res) => {
  try {
    const { country_id } = req.params;
    const deleteCountry = await Country.findByIdAndDelete(country_id);
    if (deleteCountry) {
      res.status(200).send({ messageError: "Country deleted successfully" });
    } else {
      res.status(400).send({ messageError: "Country not deleted" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  createCountry,
  deleteCountry,
};
