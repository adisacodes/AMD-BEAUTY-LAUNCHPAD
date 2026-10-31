import { useState } from "react";
import { displayName, formatTime } from "../utils/format";

export default function CodeEntry({ onCheckInByCode }) {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    const res = await onCheckInByCode(code);
    setResult(res);
    setBusy(false);
    if (res.status === "ok") setCode("");
  }

  let message = null;
  if (result?.status === "ok") {
    message = { type: "ok", text: `Welcome, ${displayName(result.guest)}!` };
  } else if (result?.status === "already") {
    message = { type: "already", text: `${displayName(result.guest)} already checked in at ${formatTime(result.time)}` };
  } else if (result?.status === "not_found") {
    message = { type: "error", text: "Code not found" };
  } else if (result?.status === "empty") {
    message = { type: "error", text: "Type a code first" };
  } else if (result?.status === "error") {
    message = { type: "error", text: result.message };
  }

  return (
    <section>
      <h2 className="section-title">Enter check-in code</h2>
      <form className="code-form" onSubmit={handleSubmit}>
        <input
          className="input"
          aria-label="Check-in code"
          placeholder="e.g. AMD-1001"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          autoCapitalize="characters"
          autoComplete="off"
        />
        <button className="btn" type="submit" disabled={busy}>{busy ? "…" : "Go"}</button>
      </form>
      {message && <div className={`msg ${message.type}`} role="status">{message.text}</div>}
    </section>
  );
}
