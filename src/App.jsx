import { useState, useEffect } from "react";
import { guests } from "./data/guests";
import { polls } from "./data/polls";
import { loadData, saveData } from "./utils/storage";
import Header from "./components/Header";
import AccessibilityBar from "./components/AccessibilityBar";
import LandingPage from "./pages/LandingPage";
import WaitingPage from "./pages/WaitingPage";
import UsherPage from "./pages/UsherPage";
import PollPage from "./pages/PollPage";
import OrganizerPage from "./pages/OrganizerPage";
import "./styles/attendee.css";


const KEYS = {
  checkedIn: "amd_checkedIn",
  votes: "amd_votes",
  answered: "amd_answered",
  pollOpen: "amd_pollOpen",
  a11y: "amd_a11y",
};

// Staff reach their screens with #usher, #organizer (or #poll for testing).
// Anyone without a hash is an attendee and sees the landing page first.
function readStaffTab() {
  const h = window.location.hash.replace("#", "");
  return ["usher", "poll", "organizer"].includes(h) ? h : null;
}

export default function App() {
  const [staffTab, setStaffTab] = useState(readStaffTab);
  const [started, setStarted] = useState(false); // attendee pressed "Get started"
  const [checkedIn, setCheckedIn] = useState(() => loadData(KEYS.checkedIn, {}));
  const [votes, setVotes] = useState(() => loadData(KEYS.votes, {}));
  const [answered, setAnswered] = useState(() => loadData(KEYS.answered, {}));
  const [pollOpen, setPollOpen] = useState(() => loadData(KEYS.pollOpen, false));
  const [a11y, setA11y] = useState(() => loadData(KEYS.a11y, { size: 0, contrast: false }));

  // Follow the address bar hash.
  useEffect(() => {
    const onHash = () => setStaffTab(readStaffTab());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Save to localStorage whenever something changes.
  useEffect(() => { saveData(KEYS.checkedIn, checkedIn); }, [checkedIn]);
  useEffect(() => { saveData(KEYS.votes, votes); }, [votes]);
  useEffect(() => { saveData(KEYS.answered, answered); }, [answered]);
  useEffect(() => { saveData(KEYS.pollOpen, pollOpen); }, [pollOpen]);

  // Apply the text size and contrast settings to the whole page.
  useEffect(() => {
    document.documentElement.dataset.size = String(a11y.size);
    document.documentElement.dataset.contrast = a11y.contrast ? "high" : "normal";
    saveData(KEYS.a11y, a11y);
  }, [a11y]);

  // Keep open tabs in sync (organizer in one tab, attendee in another).
  useEffect(() => {
    function onStorage(e) {
      if (e.key === KEYS.checkedIn) setCheckedIn(loadData(KEYS.checkedIn, {}));
      if (e.key === KEYS.votes) setVotes(loadData(KEYS.votes, {}));
      if (e.key === KEYS.pollOpen) setPollOpen(loadData(KEYS.pollOpen, false));
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function checkIn(id) {
    setCheckedIn((prev) => (prev[id] ? prev : { ...prev, [id]: new Date().toISOString() }));
  }

  // One function for code check-in, so a QR scanner could call it later.
  function checkInByCode(code) {
    const clean = code.trim().toUpperCase();
    if (!clean) return { status: "empty" };
    const guest = guests.find((g) => g.code?.trim().toUpperCase() === clean);
    if (!guest) return { status: "not_found" };
    if (checkedIn[guest.id]) return { status: "already", guest, time: checkedIn[guest.id] };
    checkIn(guest.id);
    return { status: "ok", guest };
  }

  function vote(questionId, option) {
    if (answered[questionId]) return;
    setVotes((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [option]: (prev[questionId]?.[option] || 0) + 1,
      },
    }));
    setAnswered((prev) => ({ ...prev, [questionId]: option }));
  }

  const pollPage = (
    <PollPage polls={polls} answered={answered} onVote={vote} onReset={() => setAnswered({})} />
  );

  // ----- Staff view (usher / organizer) -----
  if (staffTab) {
    return (
      <div className="app">
        <Header tab={staffTab} onTabChange={(t) => (window.location.hash = t)} />
        {staffTab === "usher" && (
          <UsherPage
            guests={guests}
            checkedIn={checkedIn}
            onCheckIn={checkIn}
            onCheckInByCode={checkInByCode}
          />
        )}
        {staffTab === "poll" && pollPage}
        {staffTab === "organizer" && (
          <OrganizerPage
            guests={guests}
            checkedIn={checkedIn}
            polls={polls}
            votes={votes}
            pollOpen={pollOpen}
            onTogglePoll={() => setPollOpen((open) => !open)}
          />
        )}
      </div>
    );
  }

  // ----- Attendee view -----
  if (!started) {
    return <LandingPage onStart={() => setStarted(true)} />;
  }

  // People who already finished keep seeing their thank-you, even if the poll closes.
  const allDone = polls.every((p) => answered[p.id]);
  const showPoll = pollOpen || allDone;

  return (
    <div className="app">
      <div className="attendee-bar">AMD BEAUTY</div>
      <AccessibilityBar
        settings={a11y}
        onChange={(patch) => setA11y((prev) => ({ ...prev, ...patch }))}
      />
      {showPoll ? (
        <>
          <h1 className="sr-only">AMD Beauty launch poll</h1>
          {pollPage}
        </>
      ) : (
        <WaitingPage />
      )}
    </div>
  );
}