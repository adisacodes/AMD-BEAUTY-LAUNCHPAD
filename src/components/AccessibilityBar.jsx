const SIZE_LABELS = ["Normal", "Large", "Extra large"];

// Two big buttons at the top of attendee screens:
// bigger text and a high-contrast colour scheme.
export default function AccessibilityBar({ settings, onChange }) {
  return (
    <section className="a11y-bar" aria-label="Display settings">
      <button
        className="a11y-btn"
        onClick={() => onChange({ size: (settings.size + 1) % SIZE_LABELS.length })}
        aria-label={`Text size: ${SIZE_LABELS[settings.size]}. Press to change.`}
      >
        <span aria-hidden="true">Aa</span> {SIZE_LABELS[settings.size]}
      </button>
      <button
        className="a11y-btn"
        aria-pressed={settings.contrast}
        onClick={() => onChange({ contrast: !settings.contrast })}
      >
        {settings.contrast ? "✓ " : ""}High contrast
      </button>
    </section>
  );
}