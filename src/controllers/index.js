const User = require("./Users");
const Manager = require("./Mnagers");
const Course = require("./Courses");
const Country = require("./Countries");
const Tutorial = require("./Tutorials");
const StudentCourse = require("./StudentCourses");
const Attendence = require("./Attendences");
const Documents = require("./Documents");
const Payments = require("./Payments");
const Email = require("./Emails");
const Posts = require("./Posts");
const SuperAdmin = require("./SuperAdmin");
const Universities = require("./Universities");
const ApplicationDeadlines = require("./ApplicationDeadlines");

const fs = require("fs");
const path = require("path");
const multer = require("multer");

// storage
const storage = (pathName) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, pathName);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname.toLocaleLowerCase());
    },
  });
};

// filter
const fFilter = (req, file, cb) => {
  // allowed ext
  const filetypes = /jpeg|jpg|png|svg|pdf|mp4/;

  // check ext
  const extname = filetypes.test(
    path.extname(file.originalname).toLocaleLowerCase()
  );

  // check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Image only");
  }
};

const uploadImage = multer({
  fileFilter: fFilter,
  storage: storage(
    path.join(path.dirname(__dirname), "public", "images", "profile")
  ),
});

const uploadImageCourse = multer({
  fileFilter: fFilter,
  storage: storage(
    path.join(path.dirname(__dirname), "public", "images", "courses")
  ),
});

const uploadFilesTutorials = multer({
  fileFilter: fFilter,
  storage: storage(path.join(path.dirname(__dirname), "public", "tutorials")),
});

const uploadDocuments = multer({
  fileFilter: fFilter,
  storage: storage(
    path.join(path.dirname(__dirname), "public", "courses", "documents")
  ),
});

const uploadImagePost = multer({
  fileFilter: fFilter,
  storage: storage(
    path.join(path.dirname(__dirname), "public", "images", "blog")
  ),
});

const uploadImageUniversity = multer({
  fileFilter: fFilter,
  storage: storage(
    path.join(path.dirname(__dirname), "public", "images", "universities")
  ),
});

module.exports = {
  uploadImage,
  uploadImageCourse,
  uploadFilesTutorials,
  uploadDocuments,
  User,
  Manager,
  Course,
  Country,
  Tutorial,
  StudentCourse,
  Attendence,
  Documents,
  Payments,
  Email,
  Posts,
  SuperAdmin,
  uploadImagePost,
  Universities,
  uploadImageUniversity,
  ApplicationDeadlines,
};
