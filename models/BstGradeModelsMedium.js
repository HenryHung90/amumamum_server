const mongoose = require("mongoose");

const BstGradeTemplatemedium = new mongoose.Schema({
  StudentId: {
    type: "string",
    required: true,
  },
  Grades: {
    type: "object",
    required: true,
  },
  Time: {
    type: "object",
    required: true,
  },
});

module.exports = mongoose.model("BstGrademedium", BstGradeTemplatemedium);
