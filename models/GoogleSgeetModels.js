const mongoose = require("mongoose");

const GoogleSheetTemplate = new mongoose.Schema({
  MajorAndType: {
    type: "string",
    required: true,
  },
  Grades: {
    type: "object",
    required: true,
  },
  AnsType: {
    type: "object",
    required: true,
  },
});

module.exports = mongoose.model("GoogleSheet", GoogleSheetTemplate);
