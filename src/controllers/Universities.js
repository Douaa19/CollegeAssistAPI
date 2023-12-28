const { University, ApplicationDeadline } = require("../models");
const path = require("path");
const fs = require("fs");

const createUniversity = async (req, res) => {
  try {
    const data = [
      req.body.name,
      req.body.description,
      req.body.country_id,
      req.body.address,
    ];
    const phones = req.body.phones ? req.body.phones.split(",") : null;
    const emails = req.body.emails ? req.body.emails.split(",") : null;
    const links = req.body.links ? req.body.links.split(",") : null;
    const socialMediaLinks = req.body.socialMediaLinks
      ? req.body.socialMediaLinks.split(",")
      : null;
    const image = req.file.filename;
    const universityExists = await University.findOne({
      name: data[0],
      country_id: data[2],
    });
    if (universityExists) {
      res.status(200).send({
        message: "This university already exists!",
        university: universityExists,
      });
    } else {
      const newUniversity = await University.create({
        name: data[0],
        description: data[1],
        country_id: data[2],
        image,
        address: data[3],
        phones,
        emails,
        links,
        socialMediaLinks,
      });
      if (newUniversity) {
        res.status(200).send(newUniversity);
      } else {
        res.status(500).send("University doesn't created!");
      }
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getUniversity = async (req, res) => {
  try {
    const { university_id } = req.params;
    const university = await University.findById(university_id).populate(
      "country_id"
    );
    if (university) {
      res.status(200).send(university);
    } else {
      res.status(404).send({ messageError: "University doesn't found!" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getUniversities = async (req, res) => {
  try {
    const universities = await University.find().populate("country_id", "name");
    if (universities.length > 0) {
      res.status(200).send(universities);
    } else {
      res.status(404).send(universities.lenght);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getUniversityImage = async (req, res) => {
  try {
    await University.findById(req.params.university_id)
      .exec()
      .then((result) => {
        res
          .status(200)
          .sendFile(
            path.join(
              path.dirname(__dirname),
              "public",
              "images",
              "universities",
              result.image
            )
          );
      });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteUniversity = async (req, res) => {
  try {
    const { university_id } = req.params;
    const university = await University.findByIdAndDelete(university_id);
    if (university) {
      fs.unlink(
        path.join(
          path.dirname(__dirname),
          "public",
          "images",
          "universities",
          university.image
        ),
        (err) => {
          if (err) {
            console.log(err);
            return;
          }
          res
            .status(200)
            .send({ messageSuccess: "University deleted successfully" });
        }
      );
    } else {
      res.status(500).send("Somthing goes wrong in back");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateUniversity = async (req, res) => {
  try {
    const path = "src\\public\\images\\universities\\";
    const { university_id } = req.params;
    const university = await University.findById(university_id).populate(
      "country_id"
    );
    if (!university) {
      res.status(404).send({ messageError: "University doesn't exist!" });
    } else {
      if (req.file.filename) {
        fs.unlink(`${path}${university.image}`, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Image deleted successfully!");
          }
        });
      }

      const data = {
        name: req.body.name,
        description: req.body.description,
        country_id: req.body.country_id,
        image: req.file.filename,
      };

      const universityExists = await University.findOne({
        name: data.name,
        country_id: data.country_id,
      });

      if (universityExists) {
        res
          .status(400)
          .send({ messageError: " University is already exists!" });
      } else {
        const editedUniversity = await University.findByIdAndUpdate(
          university_id,
          data
        );
        if (editedUniversity) {
          res.status(200).send({
            messageSuccess: "University edited successfully!",
            editedUniversity,
          });
        } else {
          res.status(400).send({ messageError: "Somthing goes wrong!" });
        }
      }
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const filterUniversity = async (req, res) => {
  try {
    const search = req.query.search || "";
    const limit = parseInt(req.query.limit) || 40;
    const page = parseInt(req.query.page) - 1 || 0;
    const sort = req.query.sort || "name";

    const textSearchQUery = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { "country_id.name": { $regex: search, $options: "i" } },
      ],
    };

    const universities = await University.find(textSearchQUery)
      .populate("country_id")
      .sort(sort)
      .limit(limit)
      .skip(page * limit);

    res.status(200).send({ total: universities.length, universities });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  createUniversity,
  getUniversity,
  getUniversities,
  getUniversityImage,
  deleteUniversity,
  updateUniversity,
  filterUniversity,
};
