const mongoose = require("mongoose");

const GradesRankingTemplate = new mongoose.Schema({
  MajorAndType: {
    type: "string",
    required: true,
  },
  Ranking: {
    type: "object",
    required: true,
  },
});

module.exports = mongoose.model("Rank", GradesRankingTemplate);
