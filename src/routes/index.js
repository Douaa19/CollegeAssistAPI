const express = require("express");
const app = express();

const auth = require("./authRoutes");
const manager = require("./managerRoutes");

app.get("/api", (req, res) => {
  res.json({
    message: "Welcom to College Assist",
  });
});

app.use("/api/auth", auth);
app.use("/api/manager", manager);

module.exports = app;
