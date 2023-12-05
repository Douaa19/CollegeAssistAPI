require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const routes = require("./src/routes");
const morgan = require("morgan");
const PORT = process.env.PORT || 8000;
const cron = require("node-cron");
const { assingStudentsToManagers } = require("./src/controllers/Users");

// require mongoose
require("./src/config/mongoose");
// routes

// meddlewares
app.use(morgan("tiny"));
app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

// routes
app.use(routes);

// cron method
cron.schedule("0 0 * * *", async () => {
  try {
    await assingStudentsToManagers();
  } catch (error) {
    console.error("Error executing assingStudentsToManagers", error.message);
  }
});

// listen to the port
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

module.exports = app;
