const express = require("express");
const app = express();

const auth = require("./authRoutes");
const manager = require("./managerRoutes");
const student = require("./studentsRoutes");
const course = require("./coursesRoutes");

app.get("/api", (req, res) => {
  res.json({
    message: "Welcom to College Assist",
  });
});

app.use("/api/auth", auth);
app.use("/api/manager", manager);
app.use("/api/student", student);
app.use("/api/course", course);

module.exports = app;
