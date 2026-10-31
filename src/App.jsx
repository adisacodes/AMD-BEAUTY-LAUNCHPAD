import { useState, useEffect } from "react";
import { guests } from "./data/guests";
import { polls } from "./data/polls";
import { loadData, saveData } from "./utils/storage";
import Header from "./components/Header";
import UsherPage from "./pages/UsherPage";
import PollPage from "./pages/PollPage";
import OrganizerPage from "./pages/OrganizerPage";

const KEYS = {
  checkedIn: "amd_checkedIn",
  votes: "amd_votes",
  answered: "amd_answered",
};

export default function App() {
  const [tab, setTab] = useState("usher");
  const [checkedIn, setCheckedIn] = useState(() => loadData(KEYS.checkedIn, {}));
  const [votes, setVotes] = useState(() => loadData(KEYS.votes, {}));
  const [answered, setAnswered] = useState(() => loadData(KEYS.answered, {}));

  // Save to localStorage whenever something changes.
  useEffect(() => { saveData(KEYS.checkedIn, checkedIn); }, [checkedIn]);
  useEffect(() => { saveData(KEYS.votes, votes); }, [votes]);
  useEffect(() => { saveData(KEYS.answered, answered); }, [answered]);

  // Keep two open tabs in sync (handy for the demo: organizer in one tab).
  useEffect(() => {
    function onStorage(e) {
      if (e.key === KEYS.checkedIn) setCheckedIn(loadData(KEYS.checkedIn, {}));
      if (e.key === KEYS.votes) setVotes(loadData(KEYS.votes, {}));
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

  return (
    <div className="app">
      <Header tab={tab} onTabChange={setTab} />
      {tab === "usher" && (
        <UsherPage
          guests={guests}
          checkedIn={checkedIn}
          onCheckIn={checkIn}
          onCheckInByCode={checkInByCode}
        />
      )}
      {tab === "poll" && (
        <PollPage polls={polls} answered={answered} onVote={vote} onReset={() => setAnswered({})} />
      )}
      {tab === "organizer" && (
        <OrganizerPage guests={guests} checkedIn={checkedIn} polls={polls} votes={votes} />
      )}
    </div>
  );
}