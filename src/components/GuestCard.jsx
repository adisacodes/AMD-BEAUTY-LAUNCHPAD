import { displayName, displayOrg, displayTicket, formatTime } from "../utils/format";

export default function GuestCard({ guest, checkedAt, onCheckIn }) {
  return (
    <li className="card">
      <div className="card-info">
        <strong>{displayName(guest)}</strong>
        <span>{displayOrg(guest)}</span>
        <span>
          {displayTicket(guest)} · {guest.code ?? "No code"}
        </span>
      </div>
      {checkedAt ? (
        <span className="badge">✓ {formatTime(checkedAt)}</span>
      ) : (
        <button className="btn" onClick={() => onCheckIn(guest.id)}>
          Check in
        </button>
      )}
    </li>
  );
}