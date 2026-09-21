import { useState } from "react";
import "./index.css";

import {
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrankPage from "./pages/PrankPage";

/* =====================================================
   API URL
===================================================== */

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

/* =====================================================
   HOME PAGE
===================================================== */

function Home() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [prankLink, setPrankLink] = useState("");
  const [loading, setLoading] = useState(false);

  /* =====================================================
     INPUT CHANGE
  ===================================================== */

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  /* =====================================================
     SIGNUP
  ===================================================== */

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setPrankLink("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.password
    ) {
      setError(
        "Please enter your name, email and password."
      );

      return;
    }

    if (formData.name.trim().length < 2) {
      setError(
        "Name must contain at least 2 characters."
      );

      return;
    }

    if (formData.password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );

      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/auth/signup`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to create your account."
        );

        return;
      }

      setSuccess(
        "Account created successfully! 🎉"
      );

      setPrankLink(data.prankLink);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setFormData({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      console.error(
        "Signup error:",
        error
      );

      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =====================================================
     COPY PRANK LINK
  ===================================================== */

  async function copyPrankLink() {
    if (!prankLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        prankLink
      );

      setSuccess(
        "Prank link copied! 🔗"
      );
    } catch (error) {
      console.error(
        "Copy failed:",
        error
      );

      setError(
        "Unable to copy the link."
      );
    }
  }

  /* =====================================================
     HOME UI
  ===================================================== */

  return (
    <div className="app">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav className="navbar">

        <div className="navbar-container">

          <div className="logo">
            😂 <span>Prank With Friends</span>
          </div>

          <Link
            to="/login"
            className="login-button"
          >
            Login
          </Link>

        </div>

      </nav>

      {/* =================================================
          HERO
      ================================================= */}

      <main className="hero">

        {/* Existing background/overlay structure preserved */}
        <div className="hero-overlay"></div>

        <div className="hero-content">

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <section className="hero-text">

            <div className="badge">
              😈 FUN • PRANK • FRIENDS
            </div>

            <h1>
              Create a
              <span> Funny Prank </span>
              for Your Friends 😂
            </h1>

            <p>
              Create your personal prank link and
              send it to your friends. Let them
              discover the surprise! ❤️
            </p>

            <div className="features">

              <div className="feature">

                <span>🔗</span>

                <div>

                  <strong>
                    Personal Link
                  </strong>

                  <small>
                    Create your own prank link
                  </small>

                </div>

              </div>

              <div className="feature">

                <span>😂</span>

                <div>

                  <strong>
                    Funny Prank
                  </strong>

                  <small>
                    Give your friends a surprise
                  </small>

                </div>

              </div>

              <div className="feature">

                <span>📊</span>

                <div>

                  <strong>
                    View Results
                  </strong>

                  <small>
                    See who tried your prank
                  </small>

                </div>

              </div>

            </div>

          </section>

          {/* =================================================
              SIGNUP CARD
          ================================================= */}

          <section className="signup-card">

            <div className="signup-header">

              <div className="signup-icon">
                🎭
              </div>

              <h2>
                Create Your Prank
              </h2>

              <p>
                Sign up and get your personal prank link
              </p>

            </div>

            {/* =================================================
                SIGNUP FORM
            ================================================= */}

            <form
              className="signup-form"
              onSubmit={handleSubmit}
            >

              {/* NAME */}

              <div className="input-group">

                <label htmlFor="name">
                  Your Name
                </label>

                <div className="input-wrapper">

                  <span>👤</span>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                  />

                </div>

              </div>

              {/* EMAIL */}

              <div className="input-group">

                <label htmlFor="email">
                  Email Address
                </label>

                <div className="input-wrapper">

                  <span>📧</span>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div className="input-group">

                <label htmlFor="password">
                  Password
                </label>

                <div className="input-wrapper">

                  <span>🔒</span>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />

                </div>

              </div>

              {/* ERROR */}

              {error && (
                <div className="form-message error-message">
                  ❌ {error}
                </div>
              )}

              {/* SUCCESS */}

              {success && (
                <div className="form-message success-message">
                  ✅ {success}
                </div>
              )}

              {/* GENERATED LINK */}

              {prankLink && (
                <div className="generated-link-box">

                  <span>
                    🎉 YOUR PRANK LINK
                  </span>

                  <div className="generated-link-row">

                    <input
                      type="text"
                      value={prankLink}
                      readOnly
                    />

                    <button
                      type="button"
                      onClick={copyPrankLink}
                    >
                      Copy
                    </button>

                  </div>

                  <div className="generated-link-actions">

                    <button
                      type="button"
                      onClick={() => {
                        window.open(
                          prankLink,
                          "_blank"
                        );
                      }}
                    >
                      🔗 Open Prank
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        navigate("/dashboard");
                      }}
                    >
                      📊 Dashboard
                    </button>

                  </div>

                </div>
              )}

              {/* CREATE BUTTON */}

              {!prankLink && (
                <button
                  type="submit"
                  className="create-button"
                  disabled={loading}
                >
                  {loading
                    ? "Creating..."
                    : "Create My Prank Link"}

                  {!loading && (
                    <span>→</span>
                  )}
                </button>
              )}

            </form>

            {/* SECURITY */}

            <div className="signup-footer">

              <span>🔐</span>

              Your information is kept secure

            </div>

          </section>

        </div>

      </main>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="footer">

        <p>

          © 2026 Prank With Friends. Made for fun ❤️

          <br />

          Developed by{" "}

          <a
            href="https://www.linkedin.com/in/sachin-upmanyu-web-developer/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sachin Upmanyu
          </a>

        </p>

      </footer>

    </div>
  );
}

/* =====================================================
   APP ROUTES
===================================================== */

function App() {
  return (
    <Routes>

      {/* HOME */}

      <Route
        path="/"
        element={<Home />}
      />

      {/* LOGIN */}

      <Route
        path="/login"
        element={<Login />}
      />

      {/* DASHBOARD */}

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      {/* PERSONAL LOVE CALCULATOR */}

      <Route
        path="/:slug"
        element={<PrankPage />}
      />

    </Routes>
  );
}

export default App;