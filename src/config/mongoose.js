const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database mongo connected");
  })
  .catch((error) => {
    console.error("Can't connect to database:", error);
  });

module.exports = mongoose;
