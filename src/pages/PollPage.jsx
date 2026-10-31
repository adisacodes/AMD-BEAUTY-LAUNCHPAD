import { useState, useEffect, useRef } from "react";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export default function PollPage({ polls, answered, onVote, onReset }) {
  // The option the person just tapped. It stays highlighted for a moment,
  // then the vote is saved and the next question slides in.
  const [picked, setPicked] = useState(null);
  const headingRef = useRef(null);

  const total = polls.length;
  const answeredCount = polls.filter((p) => answered[p.id]).length;
  const current = polls.find((p) => !answered[p.id]);

  // Move focus to each new question so screen readers read it out.
  useEffect(() => {
    headingRef.current?.focus();
  }, [current?.id]);

  function choose(option) {
    if (picked) return; // ignore double taps
    setPicked(option);
    setTimeout(() => {
      onVote(current.id, option);
      setPicked(null);
    }, 900);
  }

  const dots = (
    <div className="dots" aria-hidden="true">
      {polls.map((p) => (
        <div key={p.id} className={`dot ${answered[p.id] ? "done" : ""}`} />
      ))}
    </div>
  );

  if (!current) {
    return (
      <div className="page">
        {dots}
        <div className="poll-card poll-done slide-in">
          <div className="big" aria-hidden="true">💋</div>
          <h3 ref={headingRef} tabIndex={-1}>Thanks for voting!</h3>
          <p>Your answers are in. Watch the screen for the results.</p>
          <button className="btn secondary" onClick={onReset}>
            Vote again (demo)
          </button>
        </div>
      </div>
    );
  }

  const options = current.options ?? [];

  return (
    <div className="page">
      {dots}
      {/* key makes React replay the slide-in animation for each new question */}
      <div className="poll-card slide-in" key={current.id}>
        <div className="progress">
          Question {answeredCount + 1} of {total}
        </div>
        <h3 ref={headingRef} tabIndex={-1} id={`q-${current.id}`}>
          {current.text ?? "Untitled question"}
        </h3>
        {options.length === 0 && <p className="empty">No options for this question.</p>}
        <div className="options" role="group" aria-labelledby={`q-${current.id}`}>
          {options.map((opt, i) => (
            <button
              key={opt}
              className={`option ${picked === opt ? "picked" : ""}`}
              disabled={picked !== null}
              onClick={() => choose(opt)}
            >
              <span className="option-letter" aria-hidden="true">
                {picked === opt ? "✓" : LETTERS[i]}
              </span>
              {opt}
            </button>
          ))}
        </div>
        <p className="sr-only" role="status">
          {picked ? `Answer saved: ${picked}. Moving to the next question.` : ""}
        </p>
      </div>
    </div>
  );
}