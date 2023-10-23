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
      }
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  createCountry,
};
