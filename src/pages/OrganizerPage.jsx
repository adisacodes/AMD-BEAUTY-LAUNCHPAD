export default function OrganizerPage({ guests, checkedIn, polls, votes }) {
  const total = guests.length;
  const count = guests.filter((g) => checkedIn[g.id]).length;
  const percent = total ? Math.round((count / total) * 100) : 0;

  return (
    <div className="page">
      <div className="stat">
        <div className="progress">Checked in</div>
        <div className="stat-number">
          {count} / {total}
        </div>
        <div className="bar-track">
          <div className="bar-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>

      {polls.map((poll) => {
        const options = poll.options ?? [];
        const counts = votes[poll.id] ?? {};
        const totalVotes = options.reduce((sum, o) => sum + (counts[o] || 0), 0);
        return (
          <div className="stat" key={poll.id}>
            <strong>{poll.text}</strong>
            <div className="progress">{totalVotes} votes</div>
            {options.map((o) => {
              const n = counts[o] || 0;
              const pct = totalVotes ? Math.round((n / totalVotes) * 100) : 0;
              return (
                <div className="result-row" key={o}>
                  <div className="result-label">
                    <span>{o}</span>
                    <span>{n} ({pct}%)</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}