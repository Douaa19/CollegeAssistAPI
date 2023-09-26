const { User } = require("../models");

const register = async (req, res) => {
  try {
    const user = {};
  } catch (error) {
    res.status(500).send({
      messageError: "Somthing goes wrong in back",
      err: error.message,
    });
  }
};

const login = async (req, res) => {
  console.log("Login method");
};

module.exports = {
  register,
  login,
};
