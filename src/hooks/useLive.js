import { useState, useEffect } from "react";

// Server-Sent Events: returns a counter that bumps whenever one of `topics` changes on the server.
// Events carry no data; pages refetch through their own authorised endpoints.
export default function useLive(topics) {
  const [tick, setTick] = useState(0);
  const [connected, setConnected] = useState(false);
  const key = topics.join(",");

  useEffect(() => {
    const wanted = key.split(",");
    const es = new EventSource("/api/events");
    es.onopen = () => {
      setConnected(true);
      setTick((t) => t + 1); // Catch up on anything missed while disconnected.
    };
    es.onerror = () => setConnected(false);
    es.onmessage = (e) => {
      if (wanted.includes(e.data)) setTick((t) => t + 1);
    };
    return () => es.close();
  }, [key]);

  return { tick, connected };
}
