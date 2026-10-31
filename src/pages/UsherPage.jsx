import { useState } from "react";
import CodeEntry from "../components/CodeEntry";
import GuestCard from "../components/GuestCard";

export default function UsherPage({ guests, checkedIn, onCheckIn, onCheckInByCode }) {
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const results = guests.filter(
    (g) =>
      !q ||
      [g.name, g.organization, g.code].some((v) => (v ?? "").toLowerCase().includes(q))
  );

  return (
    <div className="page">
      <CodeEntry onCheckInByCode={onCheckInByCode} />

      <h2>Search guests</h2>
      <input
        className="input"
        placeholder="Name, organization or code"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <ul className="list">
        {results.map((g) => (
          <GuestCard
            key={g.id}
            guest={g}
            checkedAt={checkedIn[g.id]}
            onCheckIn={onCheckIn}
          />
        ))}
      </ul>
      {results.length === 0 && <p className="empty">No guests found</p>}
    </div>
  );
}