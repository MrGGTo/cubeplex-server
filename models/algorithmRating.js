const mongoose = require("mongoose");

const algorithmRatingSchema = new mongoose.Schema({
  rate: {
    type: Number,
    enum: [-1, 1],
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  alg: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Algorithm",
    required: true,
  },
});

const AlgorithmRating = mongoose.model(
  "AlgorithmRating",
  algorithmRatingSchema
);

module.exports = AlgorithmRating;
