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
      default: null,
    },
    phones: [
      {
        type: String,
        required: false,
        default: null,
      },
    ],
    emails: [
      {
        type: String,
        required: false,
        default: null,
      },
    ],
    links: [
      {
        type: String,
        required: false,
        default: null,
      },
    ],
    socialMediaLinks: [
      {
        type: String,
        required: false,
        default: null,
      },
    ],
    address: {
      type: String,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const University = mongoose.model("University", Universities);

module.exports = University;
