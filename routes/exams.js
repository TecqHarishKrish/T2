const express = require("express");
const jwt = require("jsonwebtoken");
const Exam = require("../models/Exam");
const Result = require("../models/Result");
const User = require("../models/User");

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

const authenticateAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// Create exam (admin only)
router.post("/", authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const { title, description, duration, questions } = req.body;

    if (!title || !description || !duration || !questions || questions.length === 0) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (!question.question || !question.options || question.options.length !== 4) {
        return res.status(400).json({ message: `Question ${i + 1} is invalid` });
      }
      if (typeof question.correctAnswer !== 'number' || question.correctAnswer < 0 || question.correctAnswer > 3) {
        return res.status(400).json({ message: `Question ${i + 1} has invalid correct answer` });
      }
    }

    const exam = new Exam({
      title,
      description,
      duration,
      questions,
      createdBy: req.user.userId
    });

    await exam.save();

    res.status(201).json({
      message: "Exam created successfully",
      exam
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/available", authenticateToken, async (req, res) => {
  try {
    const exams = await Exam.find({ isActive: true })
      .select("-questions.correctAnswer")
      .populate("createdBy", "username")
      .sort({ createdAt: -1 });

    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/:examId", authenticateToken, async (req, res) => {
  try {
    const { examId } = req.params;
    
    const exam = await Exam.findById(examId)
      .select("-questions.correctAnswer")
      .populate("createdBy", "username");

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/:examId/start", authenticateToken, async (req, res) => {
  try {
    const { examId } = req.params;
    const userId = req.user.userId;

    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    if (!exam.isActive) {
      return res.status(400).json({ message: "Exam is not active" });
    }

    const existingAttempt = await Result.findOne({
      student: userId,
      exam: examId,
      status: 'in_progress'
    });

    if (existingAttempt) {
      return res.status(400).json({ message: "Exam already in progress" });
    }

    const completedAttempts = await Result.countDocuments({
      student: userId,
      exam: examId,
      status: 'completed'
    });

    if (completedAttempts > 0) {
      return res.status(400).json({ message: "Exam already completed" });
    }

    const examWithAnswers = await Exam.findById(examId);

    res.json({
      exam: {
        id: exam._id,
        title: exam.title,
        description: exam.description,
        duration: exam.duration,
        questions: examWithAnswers.questions
      },
      startTime: new Date()
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/:examId/submit", authenticateToken, async (req, res) => {
  try {
    const { examId } = req.params;
    const { answers } = req.body;
    const userId = req.user.userId;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Answers are required" });
    }

    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    const existingAttempt = await Result.findOne({
      student: userId,
      exam: examId,
      status: 'completed'
    });

    if (existingAttempt) {
      return res.status(400).json({ message: "Exam already submitted" });
    }

    const processedAnswers = answers.map((answer, index) => {
      const question = exam.questions[index];
      const isCorrect = question && question.correctAnswer === answer.selectedAnswer;
      
      return {
        questionIndex: index,
        selectedAnswer: answer.selectedAnswer,
        isCorrect
      };
    });

    const correctAnswers = processedAnswers.filter(a => a.isCorrect).length;
    const totalQuestions = exam.questions.length;
    const score = correctAnswers;
    const percentage = (score / totalQuestions) * 100;

    const result = new Result({
      student: userId,
      exam: examId,
      answers: processedAnswers,
      score,
      totalQuestions,
      percentage,
      startTime: new Date(),
      submitTime: new Date(),
      status: 'completed'
    });

    await result.save();

    res.json({
      message: "Exam submitted successfully",
      result: {
        id: result._id,
        score,
        totalQuestions,
        percentage,
        correctAnswers,
        status: 'completed'
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
