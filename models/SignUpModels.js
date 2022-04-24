const mongoose = require("mongoose");

const SignUpTemplate = new mongoose.Schema({
  Name: {
    type: "string",
    required: true,
  },
  StudentId: {
    type: "string",
    required: true,
  },
  Password: {
    type: "string",
    required: true,
  },
  Email: {
    type: "string",
    required: false,
  },
  Access: {
    type: "string",
    required: true,
  },
});

module.exports = mongoose.model("Access", SignUpTemplate);
