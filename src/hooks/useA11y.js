import { useState, useEffect } from "react";
import { loadData, saveData } from "../utils/storage";

const KEY = "amd_a11y";

// Text size (0-2) and high contrast from the AccessibilityBar, applied to the whole page.
export default function useA11y() {
  const [settings, setSettings] = useState(() => loadData(KEY, { size: 0, contrast: false }));

  useEffect(() => {
    document.documentElement.dataset.size = String(settings.size);
    document.documentElement.dataset.contrast = settings.contrast ? "high" : "normal";
    saveData(KEY, settings);
  }, [settings]);

  function update(patch) {
    setSettings((prev) => ({ ...prev, ...patch }));
  }

  return [settings, update];
}
