# LaunchPad × AMD Beauty

Product-launch app with three separate experiences:

| Who | URL | Access |
| --- | --- | --- |
| Attendee | `/` → `/showcase` → `/poll` → `/results` | Public, no login |
| Usher | `/staff/login` → `/usher` | Usher account |
| Admin | `/admin/login` → `/admin` | Admin account |

Staff pages are not linked from the public site. The API enforces roles on every request.

## Run locally

Requires Node 22.13 or newer (uses the built-in `node:sqlite`).

```bash
npm ci
npm run server   # API on http://localhost:3001 (creates server/data/ on first run)
npm run dev      # app on http://localhost:5173 (proxies /api to the server)
```

On first run the server creates two accounts, `amd.admin` and `amd.usher01`, with random temporary passwords. These are written to `server/data/dev-credentials.txt`, which is gitignored and readable only by your user. Each account must set a new password at first sign-in. Delete that file once both passwords are changed.

## Production-style run

```bash
npm run build
npm start        # serves dist/ and the API from one process on port 3001
```

`npm start` marks cookies `Secure`, so it must be served over HTTPS (behind a reverse proxy).

## Tests

```bash
npm test         # API tests against a throwaway database
npm run lint
```

## Data

SQLite database at `server/data/launchpad.db`: staff accounts (scrypt-hashed passwords), sessions, guests, check-ins, poll settings and votes. Live updates use Server-Sent Events (`/api/events`).
