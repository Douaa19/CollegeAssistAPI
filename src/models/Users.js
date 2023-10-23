const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Users schema
const Users = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Invalid email format",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: [5, "the password must be greater than 5 characters"],
    },
    country: {
      type: String,
      required: false,
      default: null,
    },
    city: {
      type: String,
      required: false,
      default: null,
    },
    role: {
      type: String,
      required: true,
    },
    school: {
      type: String,
      required: false,
      default: null,
    },
    birthday: {
      type: String,
      required: false,
      default: null,
    },
    profile_img: {
      type: String,
      required: false,
      default: null,
    },
    targetCountries: [
      {
        type: String,
        required: false,
        default: null,
      },
    ],
    targetSchools: [
      {
        type: String,
        required: false,
        default: null,
      },
    ],
    lastAccess: {
      type: String,
      required: true,
      default: null,
    },
    resetToken: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      required: false,
      default: null,
    },
    manager_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

Users.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  bcrypt.hash(user.password, 10).then((hashedPassword) => {
    user.password = hashedPassword;
    next();
  });
});

Users.methods.comparePasswords = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", Users);

module.exports = User;
