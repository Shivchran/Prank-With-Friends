const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();

// ========================================
// CREATE SLUG
// ========================================

function createSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "")
    .substring(0, 30);
}

// ========================================
// GENERATE UNIQUE SLUG
// ========================================

async function generateUniqueSlug(name) {
  const baseSlug = createSlug(name) || "user";

  let slug = baseSlug;
  let counter = 1;

  while (await User.exists({ slug })) {
    slug = `${baseSlug}${counter}`;
    counter++;
  }

  return slug;
}

/* =====================================================
   SIGNUP
===================================================== */

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ========================================
    // VALIDATION
    // ========================================

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required.",
      });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message:
          "Name must contain at least 2 characters.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 6 characters.",
      });
    }

    // ========================================
    // CHECK EXISTING USER
    // ========================================

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists.",
      });
    }

    // ========================================
    // HASH PASSWORD
    // ========================================

    const passwordHash = await bcrypt.hash(
      password,
      12
    );

    // ========================================
    // CREATE UNIQUE SLUG
    // ========================================

    const slug = await generateUniqueSlug(name);

    // ========================================
    // CREATE USER
    // ========================================

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      slug,
    });

    // ========================================
    // PRODUCTION PRANK LINK
    // ========================================

    const prankLink =
      `https://soulmatecheck.universalkhabar.com/${user.slug}`;

    // ========================================
    // RESPONSE
    // ========================================

    return res.status(201).json({
      success: true,
      message: "Account created successfully!",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        slug: user.slug,
      },

      prankLink,
    });

  } catch (error) {
    console.error(
      "Signup error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while creating your account.",
    });
  }
});

/* =====================================================
   LOGIN
===================================================== */

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ========================================
    // CHECK INPUT
    // ========================================

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required.",
      });
    }

    // ========================================
    // FIND USER
    // ========================================

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    // ========================================
    // CHECK PASSWORD
    // ========================================

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.passwordHash
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    // ========================================
    // CREATE JWT
    // ========================================

    const token = jwt.sign(
      {
        userId: user._id.toString(),
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      }
    );

    // ========================================
    // SUCCESS
    // ========================================

    return res.json({
      success: true,
      message: "Login successful!",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        slug: user.slug,
      },
    });

  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while logging in.",
    });
  }
});

module.exports = router;