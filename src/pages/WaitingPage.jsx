import { useState } from "react";

const LETTERS = ["A", "B", "C", "D"];
const PRACTICE = {
  text: "How are you feeling tonight?",
  options: ["Excited", "Curious", "Relaxed"],
};

// Shown to attendees until the organizer opens the poll.
export default function WaitingPage() {
  // The practice answer is never saved or counted.
  const [picked, setPicked] = useState(null);

  return (
    <main className="page waiting">
      <div className="waiting-card">
        <div className="pulse" aria-hidden="true" />
        <h1>You're in!</h1>
        <p>
          The poll opens when the launch starts. This page changes by itself, so
          you don't need to refresh.
        </p>
      </div>

      <section className="practice" aria-labelledby="practice-title">
        <h2 id="practice-title">Warm up while you wait</h2>
        <p>Try a practice question. It does not count.</p>
        <fieldset>
          <legend>{PRACTICE.text}</legend>
          <div className="options">
            {PRACTICE.options.map((opt, i) => (
              <button
                key={opt}
                className={`option ${picked === opt ? "picked" : ""}`}
                aria-pressed={picked === opt}
                onClick={() => setPicked(opt)}
              >
                <span className="option-letter" aria-hidden="true">
                  {picked === opt ? "✓" : LETTERS[i]}
                </span>
                {opt}
              </button>
            ))}
          </div>
        </fieldset>
        <p className="practice-note" role="status">
          {picked ? "Thanks! That is how voting works. This answer was not counted." : ""}
        </p>
      </section>

      <section className="help" aria-labelledby="help-title">
        <h2 id="help-title">Need help?</h2>
        <p>Ask any usher if you need help with access, seating or anything else.</p>
      </section>
    </main>
  );
}