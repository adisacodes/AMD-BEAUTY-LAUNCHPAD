import { useState } from "react";
import { api } from "../api/client";
import { displayOrg, displayTicket, formatTime } from "../utils/format";

const EMPTY = { name: "", organization: "", ticketType: "" };

function GuestForm({ initial = EMPTY, submitLabel, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    if (!form.name.trim()) return setError("Guest name is required.");
    setBusy(true);
    setError("");
    try {
      await onSubmit(form);
      if (!onCancel) setForm(EMPTY);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="guest-form" onSubmit={submit}>
      <label className="field"><span>Name</span><input className="input" value={form.name} onChange={set("name")} maxLength={120} required /></label>
      <label className="field"><span>Organization</span><input className="input" value={form.organization} onChange={set("organization")} maxLength={120} /></label>
      <label className="field"><span>Ticket type</span><input className="input" list="ticket-types" value={form.ticketType} onChange={set("ticketType")} maxLength={40} /></label>
      <datalist id="ticket-types">
        <option value="VIP" /><option value="General" /><option value="Press" /><option value="Influencer" />
      </datalist>
      {error && <div className="msg error" role="alert">{error}</div>}
      <div className="nav-row">
        {onCancel && <button type="button" className="btn ghost grow" onClick={onCancel}>Cancel</button>}
        <button type="submit" className="btn primary grow" disabled={busy}>{busy ? "Saving…" : submitLabel}</button>
      </div>
    </form>
  );
}

export default function AdminGuests({ guests, reload }) {
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState(null);

  const q = query.trim().toLowerCase();
  const list = guests.filter((g) => !q || [g.name, g.organization, g.code].some((v) => (v ?? "").toLowerCase().includes(q)));

  async function add(form) {
    const { guest } = await api("/admin/guests", { method: "POST", body: form });
    setNotice({ type: "ok", text: `Added ${guest.name}. Invitation code: ${guest.code}` });
    reload();
  }

  async function save(id, form) {
    await api(`/admin/guests/${id}`, { method: "PUT", body: form });
    setEditing(null);
    setNotice({ type: "ok", text: "Guest updated." });
    reload();
  }

  async function act(fn, success) {
    try {
      await fn();
      setNotice({ type: "ok", text: success });
      reload();
    } catch (err) {
      setNotice({ type: "error", text: err.message });
    }
  }

  return (
    <div className="page">
      <section className="stat glass lifted">
        <p className="eyebrow">Add guest</p>
        <p className="muted small">A unique invitation code is generated automatically.</p>
        <GuestForm submitLabel="Add guest" onSubmit={add} />
      </section>

      {notice && <div className={`msg ${notice.type}`} role="status">{notice.text}</div>}

      <h2 className="section-title">All guests ({guests.length})</h2>
      <input className="input" type="search" placeholder="Search name, company or code" aria-label="Search guests" value={query} onChange={(e) => setQuery(e.target.value)} />

      <ul className="list">
        {list.map((g) =>
          editing === g.id ? (
            <li key={g.id} className="card glass column">
              <GuestForm
                initial={{ name: g.name, organization: g.organization, ticketType: g.ticketType }}
                submitLabel="Save"
                onSubmit={(form) => save(g.id, form)}
                onCancel={() => setEditing(null)}
              />
            </li>
          ) : (
            <li key={g.id} className="card glass column">
              <div className="card-info">
                <strong>{g.name}</strong>
                <span>{displayOrg(g)} · {displayTicket(g)}</span>
                <span>
                  <span className="tag">{g.code}</span>{" "}
                  {g.checkedInAt ? `Checked in ${formatTime(g.checkedInAt)}` : "Not checked in"}
                </span>
              </div>
              <div className="row-actions">
                <button type="button" className="link-btn" onClick={() => setEditing(g.id)}>
                  Edit<span className="sr-only"> {g.name}</span>
                </button>
                <button
                  type="button"
                  className="link-btn"
                  onClick={() =>
                    window.confirm(`Generate a new invitation code for ${g.name}? The old code will stop working.`) &&
                    act(() => api(`/admin/guests/${g.id}/code`, { method: "POST" }), `New code generated for ${g.name}.`)
                  }
                >
                  New code<span className="sr-only"> for {g.name}</span>
                </button>
                <button
                  type="button"
                  className="link-btn danger"
                  onClick={() =>
                    window.confirm(`Delete ${g.name}? Their check-in record will also be removed.`) &&
                    act(() => api(`/admin/guests/${g.id}`, { method: "DELETE" }), `Deleted ${g.name}.`)
                  }
                >
                  Delete<span className="sr-only"> {g.name}</span>
                </button>
              </div>
            </li>
          )
        )}
      </ul>
      {list.length === 0 && <p className="empty">No guests found</p>}
    </div>
  );
}
