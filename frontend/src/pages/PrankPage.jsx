import { useEffect, useState } from "react";

/* =====================================================
   API URL
===================================================== */

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

/* =====================================================
   PRANK PAGE
===================================================== */

function PrankPage() {
  const [yourName, setYourName] = useState("");
  const [crushName, setCrushName] = useState("");

  const [stage, setStage] = useState("checking");

  const [progress, setProgress] = useState(0);

  const [calculationStatus, setCalculationStatus] = useState(
    "🔍 Checking prank link..."
  );

  const [submitting, setSubmitting] = useState(false);

  const [submitError, setSubmitError] = useState("");

  const [ownerName, setOwnerName] = useState("");

  // =================================================
  // GET SLUG
  // =================================================

  function getSlug() {
    return window.location.pathname
      .split("/")
      .filter(Boolean)[0];
  }

  // =================================================
  // VERIFY PRANK LINK
  // =================================================

  useEffect(() => {
    async function verifyPrankLink() {
      try {
        const slug = getSlug();

        // Root URL should never be treated as prank link
        if (!slug) {
          setStage("invalid");
          return;
        }

        const response = await fetch(
          `${API_URL}/api/submission/check/${encodeURIComponent(
            slug
          )}`
        );

        const data = await response.json();

        if (!response.ok || !data.valid) {
          setStage("invalid");
          return;
        }

        // Save owner name
        setOwnerName(
          data.owner?.name || "your friend"
        );

        // Valid personal prank link
        setStage("form");
      } catch (error) {
        console.error(
          "Prank link verification error:",
          error
        );

        setStage("invalid");
      }
    }

    verifyPrankLink();
  }, []);

  // =================================================
  // SAVE SUBMISSION
  // =================================================

  async function saveSubmission() {
    try {
      setSubmitting(true);
      setSubmitError("");

      const slug = getSlug();

      if (!slug) {
        throw new Error(
          "Invalid prank link."
        );
      }

      const response = await fetch(
        `${API_URL}/api/submission`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            slug,
            yourName: yourName.trim(),
            crushName: crushName.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to save submission."
        );
      }

      console.log(
        "Submission saved:",
        data
      );

      if (data.owner?.name) {
        setOwnerName(
          data.owner.name
        );
      }

      return true;
    } catch (error) {
      console.error(
        "Submission error:",
        error
      );

      setSubmitError(
        error.message ||
          "Something went wrong."
      );

      return false;
    } finally {
      setSubmitting(false);
    }
  }

  // =================================================
  // SLOW CALCULATION ANIMATION
  // =================================================

  function startCalculation() {
    setStage("loading");

    setProgress(0);

    setCalculationStatus(
      "🔍 Checking names..."
    );

    const steps = [
      {
        progress: 8,
        text: "🔍 Checking names...",
        delay: 1000,
      },

      {
        progress: 20,
        text: "🌙 Matching Rashi...",
        delay: 1100,
      },

      {
        progress: 34,
        text: "✨ Checking birth energy...",
        delay: 1100,
      },

      {
        progress: 48,
        text: "⚡ Matching energy levels...",
        delay: 1100,
      },

      {
        progress: 62,
        text: "💫 Comparing your vibes...",
        delay: 1100,
      },

      {
        progress: 76,
        text: "❤️ Checking chemistry...",
        delay: 1100,
      },

      {
        progress: 89,
        text: "🔮 Analyzing connection...",
        delay: 1200,
      },

      {
        progress: 100,
        text: "💘 Finalizing calculation...",
        delay: 1400,
      },
    ];

    let index = 0;

    function runStep() {
      if (index >= steps.length) {
        setTimeout(() => {
          setStage("prank");
        }, 800);

        return;
      }

      const step = steps[index];

      setProgress(
        step.progress
      );

      setCalculationStatus(
        step.text
      );

      index++;

      setTimeout(
        runStep,
        step.delay
      );
    }

    runStep();
  }

  // =================================================
  // CALCULATE LOVE
  // =================================================

  async function calculateLove(event) {
    event.preventDefault();

    setSubmitError("");

    if (
      !yourName.trim() ||
      !crushName.trim()
    ) {
      setSubmitError(
        "Please enter both names."
      );

      return;
    }

    if (
      yourName.trim().length < 2
    ) {
      setSubmitError(
        "Your name must contain at least 2 characters."
      );

      return;
    }

    if (
      crushName.trim().length < 2
    ) {
      setSubmitError(
        "Crush name must contain at least 2 characters."
      );

      return;
    }

    const saved =
      await saveSubmission();

    if (!saved) {
      return;
    }

    startCalculation();
  }

  // =================================================
  // CHECKING LINK
  // =================================================

  if (stage === "checking") {
    return (
      <div className="love-page">

        <div className="love-page-overlay"></div>

        <main className="love-container">

          <section className="love-card loading-card">

            <div className="big-loading-heart">
              🔗
            </div>

            <div className="love-badge">
              ONE MOMENT
            </div>

            <h2>
              Just a moment...
            </h2>

            <p className="loading-names">
              Preparing something special for you...
            </p>

          </section>

        </main>

        <footer className="love-page-footer">

          Made with ❤️ by{" "}

          <a
            href="https://www.linkedin.com/in/sachin-upmanyu-web-developer"
            target="_blank"
            rel="noopener noreferrer"
            className="linkedin-footer-link"
          >
            Sachin Upmanyu
          </a>

        </footer>

      </div>
    );
  }

  // =================================================
  // INVALID LINK
  // =================================================

  if (stage === "invalid") {
    return (
      <div className="love-page">

        <div className="love-page-overlay"></div>

        <main className="love-container">

          <section className="love-card prank-reveal-card">

            <div className="prank-big-emoji">
              🔗
            </div>

            <div className="prank-reveal-badge">
              INVALID LINK
            </div>

            <h1>
              Prank Link
              <span>
                Not Found
              </span>
            </h1>

            <p className="prank-description">
              This prank link doesn't exist.
              Please use a personal prank link
              created by your friend.
            </p>

            <a
              href="/"
              className="create-own-prank-button"
            >
              <span>
                😂
              </span>

              Create Your Own Prank

              <span className="button-arrow">
                →
              </span>

            </a>

          </section>

        </main>

        <footer className="love-page-footer">

          Made with ❤️ by{" "}

          <a
            href="https://www.linkedin.com/in/sachin-upmanyu-web-developer"
            target="_blank"
            rel="noopener noreferrer"
            className="linkedin-footer-link"
          >
            Sachin Upmanyu
          </a>

        </footer>

      </div>
    );
  }

  // =================================================
  // LOVE CALCULATOR FORM
  // =================================================

  if (stage === "form") {
    return (
      <div className="love-page">

        <div className="love-page-overlay"></div>

        <main className="love-container">

          <section className="love-card">

            <div className="love-top-icon">
              ❤️
            </div>
            <div className="love-badge love-calculator-title">

            <span className="title-heart title-heart-left">
             💕
           </span>

           <span className="title-text">
           <span>LOVE</span>
           <span>CALCULATOR</span>
           </span>

           <span className="title-heart title-heart-right">
            💕
           </span>
           </div>
            <form
              className="love-form"
              onSubmit={calculateLove}
            >

              {/* YOUR NAME */}

              <div className="love-input-group">

                <label htmlFor="your-name">
                  Your Name
                </label>

                <div className="love-input-wrapper">

                  <span>
                    👤
                  </span>

                  <input
                    id="your-name"
                    type="text"
                    placeholder="Enter your name"
                    value={yourName}
                    onChange={(event) =>
                      setYourName(
                        event.target.value
                      )
                    }
                    required
                  />

                </div>

              </div>

              {/* HEART */}

              <div className="love-middle-heart">
                ❤️
              </div>

              {/* CRUSH NAME */}

              <div className="love-input-group">

                <label htmlFor="crush-name">
                  Crush Name
                </label>

                <div className="love-input-wrapper">

                  <span>
                    💘
                  </span>

                  <input
                    id="crush-name"
                    type="text"
                    placeholder="Enter your crush name"
                    value={crushName}
                    onChange={(event) =>
                      setCrushName(
                        event.target.value
                      )
                    }
                    required
                  />

                </div>

              </div>

              {/* ERROR */}

              {submitError && (
                <div className="form-message error-message">
                  ❌ {submitError}
                </div>
              )}

              {/* BUTTON */}

              <button
                type="submit"
                className="love-calculate-button"
                disabled={submitting}
              >

                {submitting
                  ? "Checking..."
                  : "Calculate Love"}

                {!submitting && (
                  <span>
                    ❤️
                  </span>
                )}

              </button>

            </form>
            </section>

        </main>

        <footer className="love-page-footer">

          Made with ❤️ by{" "}

          <a
            href="https://www.linkedin.com/in/sachin-upmanyu-web-developer"
            target="_blank"
            rel="noopener noreferrer"
            className="linkedin-footer-link"
          >
            Sachin Upmanyu
          </a>

        </footer>

      </div>
    );
  }

  // =================================================
  // LOADING
  // =================================================

  if (stage === "loading") {
    return (
      <div className="love-page">

        <div className="love-page-overlay"></div>

        <main className="love-container">

          <section className="love-card loading-card">

            <div className="big-loading-heart">
              ❤️
            </div>

            <div className="love-badge">
              🔍 ANALYZING LOVE
            </div>

            <h2>
              Calculating Love...
            </h2>

            <p className="loading-names">

              <strong>
                {yourName}
              </strong>

              {" ❤️ "}

              <strong>
                {crushName}
              </strong>

            </p>

            <div className="love-progress">

              <div
                className="love-progress-bar"
                style={{
                  width: `${progress}%`,
                }}
              >
              </div>

            </div>

            <div className="love-progress-number">
              {progress}%
            </div>

            <div className="calculation-status">
              {calculationStatus}
            </div>

          </section>

        </main>

        <footer className="love-page-footer">

          Made with ❤️ by{" "}

          <a
            href="https://www.linkedin.com/in/sachin-upmanyu-web-developer"
            target="_blank"
            rel="noopener noreferrer"
            className="linkedin-footer-link"
          >
            Sachin Upmanyu
          </a>

        </footer>

      </div>
    );
  }

  // =================================================
  // SUCCESSFULLY FOOLED
  // =================================================

  if (stage === "prank") {
    return (
      <div className="love-page">

        <div className="love-page-overlay"></div>

        <main className="love-container">

          <section className="love-card prank-reveal-card">

            <div className="prank-big-emoji">
              😂
            </div>

            <div className="prank-reveal-badge">
              GOTCHA! 😜
            </div>

            <h1>

              You Have Been

              <span>
                Successfully Fooled!
              </span>

            </h1>

            <p className="prank-main-message">
              😂 Don't worry! This was just a prank.
            </p>

            <p className="prank-description">

              Your crush name has been sent to{" "}

              <strong>
                {ownerName ||
                  "your friend"}
              </strong>

              .

            </p>

            <div className="prank-names">

              <div className="prank-name">
                👤 {yourName}
              </div>

              <div className="prank-heart">
                ❤️
              </div>

              <div className="prank-name">
                💘 {crushName}
              </div>

            </div>

            <div className="fooled-message">
              💌 Your secret has been sent successfully!
            </div>

            <div className="friend-turn-box">

              <div className="friend-turn-emoji">
                😈
              </div>

              <div className="friend-turn-badge">
                🎭 YOUR TURN NOW
              </div>

              <h2>
                Now It's Your Friend's Turn!
              </h2>

              <p>
                Want to prank your friends too?
                Create your own prank link and
                share it with them.
              </p>

              <a
                href="/"
                className="create-own-prank-button"
              >

                <span>
                  😂
                </span>

                Create Your Own Prank

                <span className="button-arrow">
                  →
                </span>

              </a>

            </div>

          </section>

        </main>

        <footer className="love-page-footer">

          Made with ❤️ by{" "}

          <a
            href="https://www.linkedin.com/in/sachin-upmanyu-web-developer"
            target="_blank"
            rel="noopener noreferrer"
            className="linkedin-footer-link"
          >
            Sachin Upmanyu
          </a>

        </footer>

      </div>
    );
  }

  return null;
}

export default PrankPage;