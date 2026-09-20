const express = require("express");
const Submission = require("../models/Submission");
const User = require("../models/User");

const router = express.Router();

// =================================================
// CHECK PRANK LINK
// =================================================

router.get("/check/:slug", async (req, res) => {
  try {
    const slug = req.params.slug
      .toLowerCase()
      .trim();

    if (!slug) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: "Invalid prank link.",
      });
    }

    const owner = await User.findOne({
      slug,
    }).select("name slug");

    if (!owner) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: "Prank link not found.",
      });
    }

    return res.json({
      success: true,
      valid: true,
      owner: {
        name: owner.name,
        slug: owner.slug,
      },
    });

  } catch (error) {
    console.error(
      "Check prank link error:",
      error
    );

    return res.status(500).json({
      success: false,
      valid: false,
      message: "Unable to verify prank link.",
    });
  }
});

// =================================================
// SUBMIT PRANK
// =================================================

router.post("/", async (req, res) => {
  try {
    const {
      slug,
      yourName,
      crushName,
    } = req.body;

    if (!slug || !yourName || !crushName) {
      return res.status(400).json({
        success: false,
        message:
          "Slug, your name and crush name are required.",
      });
    }

    if (yourName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message:
          "Your name must contain at least 2 characters.",
      });
    }

    if (crushName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message:
          "Crush name must contain at least 2 characters.",
      });
    }

    const owner = await User.findOne({
      slug: slug.toLowerCase().trim(),
    });

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Prank link not found.",
      });
    }

    const submission = await Submission.create({
      owner: owner._id,
      yourName: yourName.trim(),
      crushName: crushName.trim(),
      type: "love-calculator",
    });

    return res.status(201).json({
      success: true,
      message: "Submission received successfully.",

      owner: {
        name: owner.name,
      },

      submission: {
        id: submission._id,
        yourName: submission.yourName,
        crushName: submission.crushName,
      },
    });

  } catch (error) {
    console.error(
      "Submission error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while saving the submission.",
    });
  }
});

module.exports = router;