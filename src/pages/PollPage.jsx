export default function PollPage({ polls, answered, onVote, onReset }) {
  const total = polls.length;
  const answeredCount = polls.filter((p) => answered[p.id]).length;
  const current = polls.find((p) => !answered[p.id]);

  if (!current) {
    return (
      <div className="page">
        <div className="poll-card">
          <h3>Thanks for voting! 💄</h3>
          <p>Your answers were recorded.</p>
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
      <div className="poll-card">
        <div className="progress">
          Question {answeredCount + 1} of {total}
        </div>
        <h3>{current.text ?? "Untitled question"}</h3>
        {options.length === 0 && <p className="empty">No options for this question.</p>}
        <div className="options">
          {options.map((opt) => (
            <button key={opt} className="option" onClick={() => onVote(current.id, opt)}>
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}