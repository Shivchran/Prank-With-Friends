const express = require("express");
const User = require("../models/User");
const Submission = require("../models/Submission");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* =====================================================
   GET DASHBOARD DATA
===================================================== */

router.get("/", authMiddleware, async (req, res) => {
  try {
    // Find logged-in user
    const user = await User.findById(req.user.userId).select(
      "-passwordHash"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Get all submissions belonging to this user
    const submissions = await Submission.find({
      owner: user._id,
    })
      .sort({ createdAt: -1 })
      .lean();

    // Statistics
    const totalSubmissions = submissions.length;

    const prankAttempts = submissions.filter(
      (submission) =>
        submission.type === "love-calculator"
    ).length;

    const loveCalculations = submissions.filter(
      (submission) =>
        submission.type === "love-calculator"
    ).length;

    return res.json({
      success: true,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        slug: user.slug,
      },

      stats: {
        totalSubmissions,
        prankAttempts,
        loveCalculations,
      },

      submissions: submissions.map((submission) => ({
        id: submission._id,
        yourName: submission.yourName,
        crushName: submission.crushName,
        type: submission.type,
        createdAt: submission.createdAt,
      })),
    });

  } catch (error) {
    console.error("Dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load dashboard.",
    });
  }
});

module.exports = router;