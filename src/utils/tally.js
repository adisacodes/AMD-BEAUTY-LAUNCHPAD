// Vote totals for one question. Percentages come only from stored votes.
export function tally(poll, votes) {
  const counts = votes[poll.id] ?? {};
  const rows = poll.options.map((o) => ({ label: o.label, n: counts[o.label] || 0 }));
  const total = rows.reduce((sum, r) => sum + r.n, 0);
  const max = Math.max(0, ...rows.map((r) => r.n));
  return {
    total,
    rows: rows.map((r) => ({
      ...r,
      pct: total ? Math.round((r.n / total) * 100) : 0,
      leading: total > 0 && r.n === max,
    })),
  };
}
