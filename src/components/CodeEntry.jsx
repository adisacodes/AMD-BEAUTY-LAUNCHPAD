import { useState } from "react";
import { displayName, formatTime } from "../utils/format";

export default function CodeEntry({ onCheckInByCode }) {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    const res = onCheckInByCode(code);
    setResult(res);
    if (res.status === "ok") setCode("");
  }

  let message = null;
  if (result?.status === "ok") {
    message = { type: "ok", text: `Welcome, ${displayName(result.guest)}!` };
  } else if (result?.status === "already") {
    message = { type: "already", text: `Already checked in at ${formatTime(result.time)}` };
  } else if (result?.status === "not_found") {
    message = { type: "error", text: "Code not found" };
  } else if (result?.status === "empty") {
    message = { type: "error", text: "Type a code first" };
  }

  return (
    <section>
      <h2>Enter check-in code</h2>
      <form className="code-form" onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="e.g. AMD-1001"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          autoCapitalize="characters"
        />
        <button className="btn" type="submit">Go</button>
      </form>
      {message && <div className={`msg ${message.type}`}>{message.text}</div>}
    </section>
  );
}