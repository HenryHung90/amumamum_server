const mongoose = require("mongoose");

const QuestionTemplate = new mongoose.Schema({
  QuestionId: {
    type: "string",
    required: true,
  },
  IsCompleted: {
    type: "boolean",
    required: true,
  },
  StudentId: {
    type: "string",
    required: true,
  },
  Question: {
    type: "object",
    required: true,
  },
  Response: {
    type: "array",
    required: true,
  },
});

module.exports = mongoose.model("Questions", QuestionTemplate);
