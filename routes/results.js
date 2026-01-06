const express = require("express");
const jwt = require("jsonwebtoken");
const Result = require("../models/Result");
const User = require("../models/User");
const Exam = require("../models/Exam");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

router.get("/student", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const results = await Result.find({ student: userId })
      .populate("exam", "title description duration")
      .populate("student", "username email")
      .sort({ createdAt: -1 });

    const formattedResults = results.map(result => ({
      id: result._id,
      exam: {
        id: result.exam._id,
        title: result.exam.title,
        description: result.exam.description,
        duration: result.exam.duration
      },
      score: result.score,
      totalQuestions: result.totalQuestions,
      percentage: result.percentage,
      status: result.status,
      startTime: result.startTime,
      submitTime: result.submitTime,
      createdAt: result.createdAt
    }));

    res.json(formattedResults);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/:attemptId", authenticateToken, async (req, res) => {
  try {
    const { attemptId } = req.params;
    const userId = req.user.userId;

    const result = await Result.findOne({
      _id: attemptId,
      student: userId
    })
      .populate("exam")
      .populate("student", "username email");

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    const exam = await Exam.findById(result.exam._id);

    const detailedResult = {
      id: result._id,
      exam: {
        id: result.exam._id,
        title: result.exam.title,
        description: result.exam.description,
        duration: result.exam.duration,
        questions: exam.questions.map((question, index) => ({
          question: question.question,
          options: question.options,
          correctAnswer: question.correctAnswer,
          studentAnswer: result.answers[index]?.selectedAnswer,
          isCorrect: result.answers[index]?.isCorrect || false
        }))
      },
      student: {
        id: result.student._id,
        username: result.student.username,
        email: result.student.email
      },
      answers: result.answers,
      score: result.score,
      totalQuestions: result.totalQuestions,
      percentage: result.percentage,
      correctAnswers: result.answers.filter(a => a.isCorrect).length,
      status: result.status,
      startTime: result.startTime,
      submitTime: result.submitTime,
      createdAt: result.createdAt
    };

    res.json(detailedResult);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
