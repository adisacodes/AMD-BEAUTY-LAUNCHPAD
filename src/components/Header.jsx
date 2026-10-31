import ThemeToggle from "./ThemeToggle";

// Staff header band (after the Figma frames) with an optional bottom pill nav.
export default function Header({ role, title, user, onLogout, tabs, section, onSection, live, theme, onToggleTheme }) {
  const today = new Date().toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" });
  return (
    <>
      <header className="band">
        <div className="band-top">
          <span className="band-brand">LaunchPad</span>
          <span className="band-chip">{role}</span>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
        <h1 className="band-title">{title}</h1>
        <p className="band-sub">
          {today} • Product launch
          {live !== undefined && (
            <span className="live-state">{live ? " • Live" : " • Reconnecting…"}</span>
          )}
        </p>
        <div className="band-user">
          <span>Signed in as {user.username}</span>
          <button type="button" className="band-logout" onClick={onLogout}>Log out</button>
        </div>
      </header>
      {tabs && (
        <nav className="bottom-nav glass" aria-label="Sections">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              className={section === t.id ? "active" : ""}
              aria-current={section === t.id ? "page" : undefined}
              onClick={() => onSection(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      )}
    </>
  );
}
