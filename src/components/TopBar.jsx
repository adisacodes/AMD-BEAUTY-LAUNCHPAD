import ThemeToggle from "./ThemeToggle";
import AccessibilityBar from "./AccessibilityBar";
import { ArrowLeft } from "./Icons";

// Attendee header: optional back button, AMD wordmark, theme toggle, then display settings.
export default function TopBar({ onBack, backLabel = "Back", theme, onToggleTheme, a11y, onA11yChange }) {
  return (
    <>
      <header className="topbar">
        {onBack ? (
          <button type="button" className="icon-btn glass" onClick={onBack} aria-label={backLabel}>
            <ArrowLeft />
          </button>
        ) : (
          <span className="topbar-spacer" />
        )}
        <div className="wordmark" aria-label="AMD beauty">
          <span className="wordmark-main">AMD</span>
          <span className="wordmark-sub">beauty</span>
        </div>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </header>
      {a11y && <AccessibilityBar settings={a11y} onChange={onA11yChange} />}
    </>
  );
}
