require("dotenv").config();
const jwt = require("jsonwebtoken");

const authorizationRole = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      res.status(401).json({ error: "You are not authorized!" });
    } else {
      next();
    }
  };
};

module.exports = { authorizationRole };
