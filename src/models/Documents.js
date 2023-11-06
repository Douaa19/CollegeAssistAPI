const mongoose = require("mongoose");

// Documents schema
const Documents = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Document = mongoose.model("Document", Documents);

module.exports = Document;
