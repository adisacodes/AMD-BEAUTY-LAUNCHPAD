// SQLite database (Node's built-in node:sqlite, no extra dependency).
import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = resolve(process.env.DATA_DIR ?? `${here}/data`);
mkdirSync(DATA_DIR, { recursive: true, mode: 0o700 });

export const db = new DatabaseSync(process.env.DB_FILE ?? `${DATA_DIR}/launchpad.db`);

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE COLLATE NOCASE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'usher')),
    password_hash TEXT NOT NULL,
    must_change INTEGER NOT NULL DEFAULT 1,
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    last_login_at TEXT
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS guests (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    organization TEXT NOT NULL DEFAULT '',
    ticket_type TEXT NOT NULL DEFAULT '',
    code TEXT NOT NULL UNIQUE COLLATE NOCASE,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  );

  -- One row per guest: the primary key is what blocks duplicate check-ins across devices.
  CREATE TABLE IF NOT EXISTS checkins (
    guest_id INTEGER PRIMARY KEY REFERENCES guests(id) ON DELETE CASCADE,
    checked_in_at TEXT NOT NULL,
    checked_in_by INTEGER REFERENCES users(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  -- One answer per attendee per question.
  CREATE TABLE IF NOT EXISTS votes (
    attendee_id TEXT NOT NULL,
    question_id TEXT NOT NULL,
    option TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    PRIMARY KEY (attendee_id, question_id)
  );

  INSERT OR IGNORE INTO settings (key, value) VALUES ('poll_open', '1'), ('results_visible', '1');
`);

export function transaction(fn) {
  db.exec("BEGIN IMMEDIATE");
  try {
    const result = fn();
    db.exec("COMMIT");
    return result;
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
}

export function getSettings() {
  const rows = db.prepare("SELECT key, value FROM settings").all();
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return { pollOpen: map.poll_open === "1", resultsVisible: map.results_visible === "1" };
}

export function setSetting(key, on) {
  db.prepare("UPDATE settings SET value = ? WHERE key = ?").run(on ? "1" : "0", key);
}
