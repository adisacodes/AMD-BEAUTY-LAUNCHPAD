import bg from "../assets/landing-clean.jpg";
import "./LandingPage.css";

// The approved pink-splash landing screen, rebuilt with real text and a real button.
// The picture is only the background (splash and tube), so nothing depends on
// a button lining up with one baked into a screenshot.
export default function LandingPage({ onStart }) {
  return (
    <main className="landing" style={{ "--landing-art": `url(${bg})` }}>
      <div className="landing-card">
        {/* Screen readers get the label "AMD Beauty". */}
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
