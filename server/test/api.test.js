// End-to-end API tests against a throwaway database. Run: npm test
import test, { after } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const dataDir = mkdtempSync(join(tmpdir(), "launchpad-test-"));
process.env.DATA_DIR = dataDir;
process.env.PORT = "3999";
const { server } = await import("../index.js");
await new Promise((r) => (server.listening ? r() : server.once("listening", r)));
const BASE = "http://localhost:3999";

after(() => {
  server.close();
  rmSync(dataDir, { recursive: true, force: true });
});

// A tiny client with its own cookie jar (one per "device").
function client() {
  const jar = {};
  return async (method, path, body, headers = {}) => {
    const res = await fetch(BASE + path, {
      method,
      headers: {
        ...(body ? { "content-type": "application/json" } : {}),
        cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; "),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    for (const c of res.headers.getSetCookie()) {
      const [kv] = c.split(";");
      const i = kv.indexOf("=");
      jar[kv.slice(0, i)] = kv.slice(i + 1);
    }
    return { status: res.status, body: await res.json() };
  };
}

const creds = readFileSync(join(dataDir, "dev-credentials.txt"), "utf8");
const tempPw = (user) => creds.match(new RegExp(`username: ${user.replace(".", "\\.")}\\s+temporary password: (\\S+)`))[1];
const ADMIN_PW = "Admin-Strong-Pass-2026";
const USHER_PW = "Usher-Strong-Pass-2026";

const admin = client();
const usher = client();
const answers = { q1: "Latte", q2: "Moisturizing", q3: "Definitely" };

test("unauthenticated visitors cannot use staff APIs", async () => {
  const anon = client();
  assert.equal((await anon("GET", "/api/guests")).status, 401);
  assert.equal((await anon("GET", "/api/admin/ushers")).status, 401);
  assert.equal((await anon("POST", "/api/checkin", { code: "AMD-1001" })).status, 401);
  assert.deepEqual((await anon("GET", "/api/auth/me")).body, { user: null });
});

test("admin cannot log in through the usher portal, and vice versa", async () => {
  const c = client();
  assert.equal((await c("POST", "/api/auth/login", { username: "amd.admin", password: tempPw("amd.admin"), portal: "usher" })).status, 401);
  assert.equal((await c("POST", "/api/auth/login", { username: "amd.usher01", password: tempPw("amd.usher01"), portal: "admin" })).status, 401);
});

test("admin first login requires a password change", async () => {
  const login = await admin("POST", "/api/auth/login", { username: "amd.admin", password: tempPw("amd.admin"), portal: "admin" });
  assert.equal(login.status, 200);
  assert.equal(login.body.user.mustChange, true);
  const blocked = await admin("GET", "/api/admin/ushers");
  assert.equal(blocked.status, 403);
  assert.equal(blocked.body.error, "password_change_required");
  assert.equal((await admin("POST", "/api/auth/change-password", { currentPassword: tempPw("amd.admin"), newPassword: "short" })).status, 400);
  assert.equal((await admin("POST", "/api/auth/change-password", { currentPassword: "wrong", newPassword: ADMIN_PW })).status, 400);
  const changed = await admin("POST", "/api/auth/change-password", { currentPassword: tempPw("amd.admin"), newPassword: ADMIN_PW });
  assert.equal(changed.status, 200);
  assert.equal((await admin("GET", "/api/admin/ushers")).status, 200);
});

test("usher logs in, changes password, and is blocked from admin APIs", async () => {
  await usher("POST", "/api/auth/login", { username: "amd.usher01", password: tempPw("amd.usher01"), portal: "usher" });
  await usher("POST", "/api/auth/change-password", { currentPassword: tempPw("amd.usher01"), newPassword: USHER_PW });
  assert.equal((await usher("GET", "/api/guests")).status, 200);
  assert.equal((await usher("POST", "/api/admin/guests", { name: "Sneaky" })).status, 403);
  assert.equal((await usher("PUT", "/api/admin/guests/1", { name: "Sneaky" })).status, 403);
  assert.equal((await usher("DELETE", "/api/admin/guests/1")).status, 403);
  assert.equal((await usher("GET", "/api/admin/ushers")).status, 403);
  assert.equal((await usher("POST", "/api/admin/ushers", { username: "x.y" })).status, 403);
  assert.equal((await usher("PUT", "/api/admin/settings", { pollOpen: false })).status, 403);
  assert.equal((await usher("GET", "/api/admin/overview")).status, 403);
});

test("admin adds and edits a guest with a generated code; usher checks in once", async () => {
  const add = await admin("POST", "/api/admin/guests", { name: "Wanjiku Test", organization: "QA", ticketType: "VIP" });
  assert.equal(add.status, 200);
  assert.match(add.body.guest.code, /^AMD-[A-Z2-9]{6}$/);
  const id = add.body.guest.id;
  assert.equal((await admin("POST", "/api/admin/guests", { name: "  " })).status, 400);
  const edit = await admin("PUT", `/api/admin/guests/${id}`, { name: "Wanjiku Tested", organization: "QA", ticketType: "Press" });
  assert.equal(edit.body.guest.ticketType, "Press");

  const first = await usher("POST", "/api/checkin", { code: add.body.guest.code.toLowerCase() });
  assert.equal(first.body.status, "ok");
  // A second device (the admin's session) sees the duplicate.
  const again = await admin("POST", "/api/checkin", { guestId: id });
  assert.equal(again.body.status, "already");
  assert.ok(again.body.time);
  assert.equal((await usher("POST", "/api/checkin", { code: "NOPE-0000" })).body.status, "not_found");

  const list = await usher("GET", "/api/guests");
  assert.ok(list.body.guests.find((g) => g.id === id).checkedInAt);
  assert.equal(list.body.checkedIn, 1);

  assert.equal((await admin("DELETE", `/api/admin/guests/${id}`)).status, 200);
  assert.equal((await usher("GET", "/api/guests")).body.checkedIn, 0);
});

test("admin creates, deactivates and resets an usher; deactivation is immediate", async () => {
  const made = await admin("POST", "/api/admin/ushers", { username: "amd.usher02" });
  assert.equal(made.status, 200);
  assert.ok(made.body.tempPassword.length >= 16);
  assert.equal((await admin("POST", "/api/admin/ushers", { username: "amd.usher02" })).status, 409);
  assert.equal((await admin("POST", "/api/admin/ushers", { username: "bad name!" })).status, 400);

  const u2 = client();
  assert.equal((await u2("POST", "/api/auth/login", { username: "amd.usher02", password: made.body.tempPassword, portal: "usher" })).status, 200);
  await u2("POST", "/api/auth/change-password", { currentPassword: made.body.tempPassword, newPassword: "Usher2-Strong-Pass" });
  assert.equal((await u2("GET", "/api/guests")).status, 200);

  const id = (await admin("GET", "/api/admin/ushers")).body.ushers.find((u) => u.username === "amd.usher02").id;
  await admin("PATCH", `/api/admin/ushers/${id}`, { active: false });
  assert.equal((await u2("GET", "/api/guests")).status, 401);
  assert.equal((await u2("POST", "/api/auth/login", { username: "amd.usher02", password: "Usher2-Strong-Pass", portal: "usher" })).status, 401);

  await admin("PATCH", `/api/admin/ushers/${id}`, { active: true });
  const reset = await admin("POST", `/api/admin/ushers/${id}/reset-password`);
  assert.equal((await u2("POST", "/api/auth/login", { username: "amd.usher02", password: "Usher2-Strong-Pass", portal: "usher" })).status, 401);
  const relog = await u2("POST", "/api/auth/login", { username: "amd.usher02", password: reset.body.tempPassword, portal: "usher" });
  assert.equal(relog.body.user.mustChange, true);
});

test("attendee votes once; validation, visibility and closing are enforced", async () => {
  const a = client();
  assert.equal((await a("GET", "/api/poll")).body.submitted, false);
  assert.equal((await a("POST", "/api/poll/vote", { answers: { ...answers, q2: "Natural ingredients" } })).status, 400);
  assert.equal((await a("POST", "/api/poll/vote", { answers: { q1: "Latte" } })).status, 400);
  assert.equal((await a("POST", "/api/poll/vote", { answers })).status, 200);
  assert.equal((await a("POST", "/api/poll/vote", { answers })).status, 409);
  assert.equal((await a("GET", "/api/poll")).body.submitted, true);

  const r = await a("GET", "/api/poll/results");
  assert.equal(r.body.votes.q1.Latte, 1);
  assert.equal(r.body.voters, 1);

  await admin("PUT", "/api/admin/settings", { resultsVisible: false });
  assert.equal((await a("GET", "/api/poll/results")).status, 403);
  assert.equal((await admin("GET", "/api/poll/results")).status, 200);
  await admin("PUT", "/api/admin/settings", { resultsVisible: true, pollOpen: false });
  const b = client();
  assert.equal((await b("POST", "/api/poll/vote", { answers })).status, 409);
  await admin("PUT", "/api/admin/settings", { pollOpen: true });
  assert.equal((await b("POST", "/api/poll/vote", { answers })).status, 200);
  assert.equal((await admin("GET", "/api/admin/overview")).body.voters, 2);
});

test("cross-site requests are rejected", async () => {
  const res = await admin("PUT", "/api/admin/settings", { pollOpen: false }, { origin: "https://evil.example" });
  assert.equal(res.status, 403);
  assert.equal((await admin("GET", "/api/admin/overview")).body.settings.pollOpen, true);
  // The app's own pages (same origin) must still work.
  const same = await admin("PUT", "/api/admin/settings", { pollOpen: true }, { origin: BASE });
  assert.equal(same.status, 200);
});

test("logout ends the session", async () => {
  await usher("POST", "/api/auth/logout");
  assert.deepEqual((await usher("GET", "/api/auth/me")).body, { user: null });
  assert.equal((await usher("GET", "/api/guests")).status, 401);
});

test("login is rate limited after repeated failures", async () => {
  const c = client();
  for (let i = 0; i < 5; i++) {
    assert.equal((await c("POST", "/api/auth/login", { username: "amd.usher01", password: "wrong", portal: "usher" })).status, 401);
  }
  assert.equal((await c("POST", "/api/auth/login", { username: "amd.usher01", password: USHER_PW, portal: "usher" })).status, 429);
});
