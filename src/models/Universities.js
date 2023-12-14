const mongoose = require("mongoose");

// Universities schema
const Universities = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    country_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const University = mongoose.model("University", Universities);

module.exports = University;
