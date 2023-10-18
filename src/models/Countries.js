const mongoose = require("mongoose");

// Users schema
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

const County = mongoose.model("County", Countries);

module.exports = County;
