import { useState, useEffect, useCallback } from "react";
import { api } from "../api/client";

// Fetches `path`, refetching whenever `tick` changes (live updates) or reload() is called.
export default function useApiData(path, tick = 0) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    api(path)
      .then((data) => !cancelled && setState({ data, error: null, loading: false }))
      .catch((error) => !cancelled && setState((s) => ({ data: s.data, error, loading: false })));
    return () => {
      cancelled = true;
    };
  }, [path, tick, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  return { ...state, reload };
}
