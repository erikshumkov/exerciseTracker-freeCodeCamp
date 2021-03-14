const mongoose = require("mongoose")

const ExerciseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  date: {
    type: String
  }
})

const Exercise = mongoose.model("Exercise", ExerciseSchema)

module.exports = Exercise;