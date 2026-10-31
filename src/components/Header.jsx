const TABS = [
  { id: "usher", label: "Usher" },
  { id: "poll", label: "Poll" },
  { id: "organizer", label: "Organizer" },
];

export default function Header({ tab, onTabChange }) {
  return (
    <>
      <header className="header">
        <h1>AMD BEAUTY</h1>
        <p>Launch night: check-in and live poll</p>
      </header>
      <nav className="tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab ${tab === t.id ? "active" : ""}`}
            onClick={() => onTabChange(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>
    </>
  );
}