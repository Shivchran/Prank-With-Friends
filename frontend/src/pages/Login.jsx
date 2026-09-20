import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
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
        setError(data.message || "Login failed.");
        return;
      }

      /*
        Save login information
      */

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setMessage("Login successful! 🎉");

      /*
        Go to dashboard
      */

      setTimeout(() => {
        navigate("/dashboard");
      }, 800);

    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

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

          {/* Header */}

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

            {/* Email */}

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


            {/* Password */}

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


            {/* Forgot Password */}

            <div className="forgot-row">

              <button
                type="button"
                className="forgot-button"
              >
                Forgot Password?
              </button>

            </div>


            {/* Error */}

            {error && (
              <div className="form-message error-message">
                ❌ {error}
              </div>
            )}


            {/* Success */}

            {message && (
              <div className="form-message success-message">
                ✅ {message}
              </div>
            )}


            {/* Login */}

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


          {/* Signup */}

          <div className="login-bottom">

            <span>
              Don't have an account?
            </span>

            <Link to="/">
              Create Your Prank
            </Link>

          </div>


          {/* Security */}

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