const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const predictionSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  gender: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
});

const Prediction = mongoose.model("prediction", predictionSchema);

module.exports = Prediction;
