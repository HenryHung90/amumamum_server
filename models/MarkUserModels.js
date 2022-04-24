const mongoose = require("mongoose");

const MarkUserTemplate = new mongoose.Schema({
  StudentId: {
    type: "string",
    required: true,
  },
  Mark: {
    type: "object",
    required: true,
  },
});

module.exports = mongoose.model("Mark", MarkUserTemplate);
