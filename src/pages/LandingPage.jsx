import bg from "../assets/landing-clean.jpg";
import "./LandingPage.css";

// The designer's landing screen, rebuilt with real text and a real button.
// The picture is only the background (splash and tube), so nothing depends on
// invisible buttons lining up with a screenshot.
export default function LandingPage({ onStart }) {
  return (
    <main className="landing">
      <div className="landing-card" style={{ backgroundImage: `url(${bg})` }}>
        {/* The first letter is a Greek capital lambda so it looks like the logo's
            A without a crossbar. Screen readers get the label "AMD Beauty". */}
        <h1 className="logo" aria-label="AMD Beauty">
          <span className="logo-amd" aria-hidden="true">AMD</span>
          <span className="logo-beauty" aria-hidden="true">BEAUTY</span>
        </h1>

        <button type="button" className="landing-start" onClick={onStart}>
          Get started
        </button>
      </div>
    </main>
  );
}