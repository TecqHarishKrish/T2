const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
  questionIndex: {
    type: Number,
    required: true
  },
  selectedAnswer: {
    type: Number,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  }
});

const ResultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  answers: [AnswerSchema],
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  submitTime: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['completed', 'in_progress'],
    default: 'completed'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Result", ResultSchema);
