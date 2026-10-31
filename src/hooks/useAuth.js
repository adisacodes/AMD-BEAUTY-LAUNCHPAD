import { useState, useEffect, useCallback } from "react";
import { api } from "../api/client";

// Current staff user from the server session cookie. Only used on staff routes.
export default function useAuth(enabled) {
  const [state, setState] = useState({ loading: true, user: null });

  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    api("/auth/me")
      .then(({ user }) => !cancelled && setState({ loading: false, user }))
      .catch(() => !cancelled && setState({ loading: false, user: null }));
    return () => {
      cancelled = true;
    };
  }, [enabled, version]);

  async function login(username, password, portal) {
    const { user } = await api("/auth/login", { method: "POST", body: { username, password, portal } });
    setState({ loading: false, user });
    return user;
  }

  async function changePassword(currentPassword, newPassword) {
    const { user } = await api("/auth/change-password", { method: "POST", body: { currentPassword, newPassword } });
    setState({ loading: false, user });
  }

  async function logout() {
    try {
      await api("/auth/logout", { method: "POST" });
    } finally {
      setState({ loading: false, user: null });
    }
  }

  return { ...state, login, logout, changePassword, refresh };
}
