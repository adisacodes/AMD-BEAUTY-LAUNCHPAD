import { displayName, displayOrg, displayTicket, formatTime } from "../utils/format";
import { ArrowRight } from "./Icons";

function initials(guest) {
  const parts = (guest?.name ?? "").trim().split(/\s+/).filter(Boolean);
  return parts.length ? (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase() : "?";
}

export default function GuestCard({ guest, checkedAt, onCheckIn }) {
  return (
    <li className="card glass">
      <span className="avatar" aria-hidden="true">{initials(guest)}</span>
      <div className="card-info">
        <strong>{displayName(guest)}</strong>
        <span>{displayOrg(guest)}</span>
        <span>
          <span className="tag">{displayTicket(guest)}</span> {guest.code ?? "No code"}
        </span>
      </div>
      {checkedAt ? (
        <span className="badge">✓ Checked in {formatTime(checkedAt)}</span>
      ) : (
        <button className="btn primary" onClick={() => onCheckIn(guest.id)}>
          Check in<span className="sr-only"> {displayName(guest)}</span> <ArrowRight />
        </button>
      )}
    </li>
  );
}
