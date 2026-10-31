import { useState } from "react";
import QrScanner from "./QrScanner";
import { displayName, formatTime } from "../utils/format";

// Where the browser can't scan QR codes, the button is hidden and ushers type the code instead.
const canScan = "BarcodeDetector" in window && !!navigator.mediaDevices?.getUserMedia;

export default function CodeEntry({ onCheckInByCode }) {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [scanning, setScanning] = useState(false);

  async function submitCode(value) {
    if (busy) return;
    setBusy(true);
    const res = await onCheckInByCode(value);
    setResult(res);
    setBusy(false);
    if (res.status === "ok") setCode("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    submitCode(code);
  }

  // The invitation QR holds the check-in code; scanning runs the same server check as typing it.
  function onScanned(value) {
    setScanning(false);
    setCode(value);
    submitCode(value);
  }

  let message = null;
  if (result?.status === "ok") {
    message = { type: "ok", text: `Invitation confirmed. Welcome, ${displayName(result.guest)}!` };
  } else if (result?.status === "already") {
    message = { type: "already", text: `${displayName(result.guest)} already checked in at ${formatTime(result.time)}` };
  } else if (result?.status === "revoked") {
    message = { type: "error", text: `${displayName(result.guest)}'s invitation was revoked. Please ask the organizer.` };
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
      {canScan && !scanning && (
        <button type="button" className="btn ghost block" onClick={() => setScanning(true)}>Scan invitation QR</button>
      )}
      {scanning && <QrScanner onCode={onScanned} onClose={() => setScanning(false)} />}
      {message && <div className={`msg ${message.type}`} role="status">{message.text}</div>}
    </section>
  );
}
