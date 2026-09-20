import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    prankAttempts: 0,
    loveCalculations: 0,
  });

  const [submissions, setSubmissions] = useState([]);

  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/dashboard",
          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/login");
          return;
        }

        setUser(data.user);

        setStats(
          data.stats || {
            totalSubmissions: 0,
            prankAttempts: 0,
            loveCalculations: 0,
          }
        );

        setSubmissions(data.submissions || []);

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

      } catch (error) {
        console.error("Dashboard error:", error);

        navigate("/login");

      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [navigate]);

  function copyPrankLink() {
    if (!user) return;

    const prankLink = `${window.location.origin}/${user.slug}`;

    navigator.clipboard.writeText(prankLink);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  }

  function formatDate(date) {
    if (!date) return "";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const prankLink = `${window.location.origin}/${user.slug}`;

  return (
    <div className="dashboard-page">

      {/* =========================
          NAVBAR
      ========================== */}

      <nav className="dashboard-navbar">

        <div className="dashboard-navbar-container">

          <Link
            to="/dashboard"
            className="dashboard-logo"
          >
            😂 <span>Prank With Friends</span>
          </Link>

          <div className="dashboard-user">

            <div className="dashboard-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div className="dashboard-user-info">
              <strong>{user.name}</strong>
              <small>{user.email}</small>
            </div>

            <button
              className="logout-button"
              onClick={logout}
            >
              Logout
            </button>

          </div>

        </div>

      </nav>


      {/* =========================
          MAIN CONTENT
      ========================== */}

      <main className="dashboard-content">

        {/* Welcome */}

        <section className="dashboard-welcome">

          <div>

            <span className="dashboard-badge">
              🎉 YOUR DASHBOARD
            </span>

            <h1>
              Welcome, {user.name}! 👋
            </h1>

            <p>
              Manage your prank link and see who tried your prank.
            </p>

          </div>

        </section>


        {/* =========================
            PERSONAL LINK
        ========================== */}

        <section className="prank-link-card">

          <div className="prank-link-icon">
            🔗
          </div>

          <div className="prank-link-content">

            <span>
              YOUR PERSONAL PRANK LINK
            </span>

            <h2>
              Share this link with your friends 😈
            </h2>

            <div className="link-box">

              <input
                type="text"
                value={prankLink}
                readOnly
              />

              <button onClick={copyPrankLink}>
                {copied ? "Copied! ✓" : "Copy Link"}
              </button>

            </div>

          </div>

        </section>


        {/* =========================
            STATISTICS
        ========================== */}

        <section className="dashboard-stats">

          <div className="stat-card">

            <div className="stat-icon">
              🎭
            </div>

            <div>

              <span>
                TOTAL SUBMISSIONS
              </span>

              <strong>
                {stats.totalSubmissions}
              </strong>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              😂
            </div>

            <div>

              <span>
                PRANK ATTEMPTS
              </span>

              <strong>
                {stats.prankAttempts}
              </strong>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ❤️
            </div>

            <div>

              <span>
                LOVE CALCULATIONS
              </span>

              <strong>
                {stats.loveCalculations}
              </strong>

            </div>

          </div>

        </section>


        {/* =========================
            RECENT SUBMISSIONS
        ========================== */}

        <section className="submissions-card">

          <div className="section-header">

            <div>

              <span>
                📊 ACTIVITY
              </span>

              <h2>
                Recent Prank Submissions
              </h2>

            </div>

          </div>


          {submissions.length === 0 ? (

            <div className="empty-submissions">

              <div className="empty-icon">
                😴
              </div>

              <h3>
                No prank attempts yet
              </h3>

              <p>
                Share your personal prank link with your friends
                and wait for the fun to begin!
              </p>

              <button
                className="dashboard-share-button"
                onClick={copyPrankLink}
              >
                🔗 Copy My Prank Link
              </button>

            </div>

          ) : (

            <div className="submissions-list">

              {submissions.map((submission) => (

                <div
                  className="submission-item"
                  key={submission.id}
                >

                  <div className="submission-icon">
                    😂
                  </div>

                  <div className="submission-info">

                    <strong>
                      {submission.yourName}
                      {" ❤️ "}
                      {submission.crushName}
                    </strong>

                    <span>
                      Love Calculator
                    </span>

                  </div>

                  <div className="submission-date">
                    {formatDate(
                      submission.createdAt
                    )}
                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Dashboard;