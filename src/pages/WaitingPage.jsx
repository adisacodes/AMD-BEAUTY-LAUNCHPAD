import { useState } from "react";

const PRACTICE = {
  text: "How are you feeling tonight?",
  options: ["Excited", "Curious", "Relaxed"],
};

// Shown to attendees until the organizer opens the poll.
export default function WaitingPage({ onBack }) {
  // The practice answer is never saved or counted.
  const [picked, setPicked] = useState(null);

  return (
    <div className="waiting">
      <div className="card-center glass waiting-card">
        <div className="pulse" aria-hidden="true" />
        <h1 className="serif">You're in!</h1>
        <p className="muted">
          The poll opens when the launch starts. This page changes by itself, so
          you don't need to refresh.
        </p>
      </div>

      <section className="practice glass" aria-labelledby="practice-title">
        <h2 id="practice-title" className="serif">Warm up while you wait</h2>
        <p className="muted small">Try a practice question. It does not count.</p>
        <fieldset>
          <legend>{PRACTICE.text}</legend>
          <div className="options">
            {PRACTICE.options.map((opt, i) => (
              <button
                key={opt}
                type="button"
                className={`option simple glass ${picked === opt ? "selected" : ""}`}
                aria-pressed={picked === opt}
                onClick={() => setPicked(opt)}
              >
                <span className="letter" aria-hidden="true">
                  {picked === opt ? "✓" : String.fromCharCode(65 + i)}
                </span>
                <span className="opt-text"><strong>{opt}</strong></span>
              </button>
            ))}
          </div>
        </fieldset>
        <p className="practice-note" role="status">
          {picked ? "Thanks! That is how voting works. This answer was not counted." : ""}
        </p>
      </section>

      <section className="help glass" aria-labelledby="help-title">
        <h2 id="help-title" className="serif">Need help?</h2>
        <p className="muted">Ask any usher if you need help with access, seating or anything else.</p>
      </section>

      {onBack && (
        <button type="button" className="btn ghost block waiting-back" onClick={onBack}>
          Back to products
        </button>
      )}
    </div>
  );
}
