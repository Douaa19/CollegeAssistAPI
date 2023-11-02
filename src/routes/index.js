const express = require("express");
const app = express();

const auth = require("./authRoutes");
const manager = require("./managerRoutes");
const student = require("./studentsRoutes");
const course = require("./coursesRoutes");
const country = require("./countriesRoutes");
const tutorial = require("./tutorialsRoutes");
const attendence = require("./attendenceRoutes");

app.get("/api", (req, res) => {
  res.json({
    message: "Welcom to College Assist",
  });
});

app.use("/api", auth);
app.use("/api/manager", manager);
app.use("/api/student", student);
app.use("/api/course", course);
app.use("/api/country", country);
app.use("/api/tutorial", tutorial);
app.use("/api/attendence", attendence);

module.exports = app;
