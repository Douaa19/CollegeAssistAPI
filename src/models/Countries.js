const mongoose = require("mongoose");

// Countries schema
const Countries = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Country = mongoose.model("Country", Countries);

module.exports = Country;
