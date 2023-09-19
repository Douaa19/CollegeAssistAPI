require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const PORT = process.env.PORT || 8000;

// require mongoose
require("./src/config/mongoose");
// routes

// meddlewares
app.use(morgan("tiny"));
app.use(
  cors({
    methods: ["GET", "POST"],
  })
);
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

// welcom
app.get("/api", (req, res) => {
  res.json({
    message: "Welcom to College Assist",
  });
});

// use routes

// listen to the port
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

module.exports = app;
