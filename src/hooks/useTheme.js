import { useState, useEffect } from "react";
import { loadData, saveData } from "../utils/storage";

const KEY = "amd_theme";
const QUERY = "(prefers-color-scheme: dark)";

// A saved manual choice wins; otherwise follow the system setting.
export default function useTheme() {
  const [pref, setPref] = useState(() => loadData(KEY, null));
  const [systemDark, setSystemDark] = useState(() => window.matchMedia(QUERY).matches);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = (e) => setSystemDark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const theme = pref ?? (systemDark ? "dark" : "light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setPref(next);
    saveData(KEY, next);
  }

  return [theme, toggle];
}
