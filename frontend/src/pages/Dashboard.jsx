import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/* =====================================================
   API URL
===================================================== */

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

/* =====================================================
   DASHBOARD
===================================================== */

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

  // Music states
  const [musicUpdating, setMusicUpdating] = useState(false);
  const [musicMessage, setMusicMessage] = useState("");

  // Delete states
  const [deletingAll, setDeletingAll] = useState(false);

  /* =====================================================
     LOAD DASHBOARD
  ===================================================== */

  useEffect(() => {
    async function loadDashboard() {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/dashboard`,
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

        setUser({
          ...data.user,

          // Default OFF if field is not present
          musicEnabled: data.user.musicEnabled ?? false,
        });

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

  /* =====================================================
     COPY PRANK LINK
  ===================================================== */

  async function copyPrankLink() {
    if (!user) {
      return;
    }

    const prankLink =
      `${window.location.origin}/${user.slug}`;

    try {
      await navigator.clipboard.writeText(prankLink);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  }

  /* =====================================================
     MUSIC ON / OFF
  ===================================================== */

  async function toggleMusic() {
    if (!user || musicUpdating) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const newMusicState = !user.musicEnabled;

    setMusicUpdating(true);
    setMusicMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/dashboard/music`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            musicEnabled: newMusicState,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to update music setting."
        );
      }

      setUser((previousUser) => ({
        ...previousUser,
        musicEnabled: data.musicEnabled,
      }));

      const storedUser =
        JSON.parse(
          localStorage.getItem("user") || "{}"
        );

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          musicEnabled: data.musicEnabled,
        })
      );

      setMusicMessage(
        data.musicEnabled
          ? "Background music is ON 🎵"
          : "Background music is OFF 🔇"
      );

      setTimeout(() => {
        setMusicMessage("");
      }, 2500);
    } catch (error) {
      console.error(
        "Music setting error:",
        error
      );

      setMusicMessage(
        "Unable to update music setting."
      );
    } finally {
      setMusicUpdating(false);
    }
  }

  /* =====================================================
     DELETE ALL SUBMISSIONS
  ===================================================== */

  async function deleteAllSubmissions() {
    if (
      submissions.length === 0 ||
      deletingAll
    ) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete all prank submissions? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setDeletingAll(true);

      const response = await fetch(
        `${API_URL}/api/dashboard/submissions`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete submissions."
        );
      }

      // Clear submissions from UI
      setSubmissions([]);

      // Reset statistics
      setStats({
        totalSubmissions: 0,
        prankAttempts: 0,
        loveCalculations: 0,
      });

    } catch (error) {
      console.error(
        "Delete all submissions error:",
        error
      );

      window.alert(
        error.message ||
          "Unable to delete submissions."
      );
    } finally {
      setDeletingAll(false);
    }
  }

  /* =====================================================
     LOGOUT
  ===================================================== */

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  }

  /* =====================================================
     FORMAT DATE
  ===================================================== */

  function formatDate(date) {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  }

  /* =====================================================
     LOADING
  ===================================================== */

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

  const prankLink =
    `${window.location.origin}/${user.slug}`;

  /* =====================================================
     UI
  ===================================================== */

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
              {user.name
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="dashboard-user-info">

              <strong>
                {user.name}
              </strong>

              <small>
                {user.email}
              </small>

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

        {/* WELCOME */}

        <section className="dashboard-welcome">

          <div>

            <span className="dashboard-badge">
              🎉 YOUR DASHBOARD
            </span>

            <h1>
              Welcome, {user.name}! 👋
            </h1>

            <p>
              Manage your prank link and see
              who tried your prank.
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
              Share this link with your
              friends 😈
            </h2>

            <div className="link-box">

              <input
                type="text"
                value={prankLink}
                readOnly
              />

              <button
                onClick={copyPrankLink}
              >
                {copied
                  ? "Copied! ✓"
                  : "Copy Link"}
              </button>

            </div>

          </div>

        </section>

        {/* =========================
            BACKGROUND MUSIC
        ========================== */}

        <section className="music-control-card">

          <div className="music-control-info">

            <div className="music-control-icon">
              {user.musicEnabled
                ? "🎵"
                : "🔇"}
            </div>

            <div>

              <span>
                BACKGROUND MUSIC
              </span>

              <h2>
                Romantic Music
              </h2>

              <p>
                Turn this ON to play background
                music on your personal prank link.
              </p>

            </div>

          </div>

          <button
            type="button"
            className={`music-toggle ${
              user.musicEnabled
                ? "music-toggle-on"
                : "music-toggle-off"
            }`}
            onClick={toggleMusic}
            disabled={musicUpdating}
            aria-pressed={user.musicEnabled}
          >
            <span className="music-toggle-circle">
              {user.musicEnabled
                ? "🎵"
                : "🔇"}
            </span>

            <span>
              {musicUpdating
                ? "Saving..."
                : user.musicEnabled
                ? "ON"
                : "OFF"}
            </span>
          </button>

          {musicMessage && (
            <div className="music-message">
              {musicMessage}
            </div>
          )}

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

            {submissions.length > 0 && (
              <button
                type="button"
                className="delete-all-button"
                onClick={deleteAllSubmissions}
                disabled={deletingAll}
              >
                {deletingAll
                  ? "Deleting..."
                  : "🗑️ Delete All"}
              </button>
            )}

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
                Share your personal prank link
                with your friends and wait for
                the fun to begin!
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

              {submissions.map(
                (submission) => (

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

                )
              )}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Dashboard;