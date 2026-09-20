import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/* =====================================================
   API URL
===================================================== */

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

/* =====================================================
   LOGIN PAGE
===================================================== */

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
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
    setMessage("");
  }

  /* =====================================================
     LOGIN
  ===================================================== */

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!formData.email || !formData.password) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Login failed."
        );
        return;
      }

      /* =================================================
         SAVE LOGIN INFORMATION
      ================================================= */

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setMessage(
        "Login successful! 🎉"
      );

      /* =================================================
         GO TO DASHBOARD
      ================================================= */

      setTimeout(() => {
        navigate("/dashboard");
      }, 800);

    } catch (error) {
      console.error(
        "Login error:",
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
     UI
  ===================================================== */

  return (
    <div className="auth-page">

      <div className="auth-overlay"></div>

      {/* =========================
          NAVBAR
      ========================== */}

      <nav className="navbar">

        <div className="navbar-container">

          <Link
            to="/"
            className="logo logo-link"
          >
            😂 <span>Prank With Friends</span>
          </Link>

          <Link
            to="/"
            className="back-home-button"
          >
            ← Home
          </Link>

        </div>

      </nav>

      {/* =========================
          LOGIN CONTENT
      ========================== */}

      <main className="auth-content">

        <section className="login-card">

          {/* HEADER */}

          <div className="login-header">

            <div className="login-icon">
              🔐
            </div>

            <h1>
              Welcome Back!
            </h1>

            <p>
              Login to manage your prank link
            </p>

          </div>

          {/* =========================
              LOGIN FORM
          ========================== */}

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            {/* EMAIL */}

            <div className="input-group">

              <label htmlFor="login-email">
                Email Address
              </label>

              <div className="input-wrapper">

                <span>
                  📧
                </span>

                <input
                  id="login-email"
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

              <label htmlFor="login-password">
                Password
              </label>

              <div className="input-wrapper">

                <span>
                  🔒
                </span>

                <input
                  id="login-password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />

              </div>

            </div>

            {/* FORGOT PASSWORD */}

            <div className="forgot-row">

              <button
                type="button"
                className="forgot-button"
              >
                Forgot Password?
              </button>

            </div>

            {/* ERROR */}

            {error && (
              <div className="form-message error-message">
                ❌ {error}
              </div>
            )}

            {/* SUCCESS */}

            {message && (
              <div className="form-message success-message">
                ✅ {message}
              </div>
            )}

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="create-button login-submit"
              disabled={loading}
            >

              {loading
                ? "Logging in..."
                : "Login to My Account"
              }

              {!loading && (
                <span>
                  →
                </span>
              )}

            </button>

          </form>

          {/* SIGNUP */}

          <div className="login-bottom">

            <span>
              Don't have an account?
            </span>

            <Link to="/">
              Create Your Prank
            </Link>

          </div>

          {/* SECURITY */}

          <div className="signup-footer">

            <span>
              🔐
            </span>

            Your information is kept secure

          </div>

        </section>

      </main>

    </div>
  );
}

export default Login;