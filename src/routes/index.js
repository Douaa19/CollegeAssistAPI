const express = require("express");
const app = express();

const auth = require("./authRoutes");

app.get("/api", (req, res) => {
  res.json({
    message: "Welcom to College Assist",
  });
});

app.use("/api/auth", auth);

module.exports = app;
