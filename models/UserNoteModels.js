const mongoose = require("mongoose");

const MarkUserTemplate = new mongoose.Schema({
  StudentId: {
    type: "string",
    required: true,
  },
  NoteClassify: {
    type: "array",
    required: true,
  },
  NoteContent: {
    type: "array",
    required: true,
  },
});

module.exports = mongoose.model("Note", MarkUserTemplate);
