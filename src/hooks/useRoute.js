import { useState, useEffect, useCallback } from "react";

const ROUTES = new Set(["", "showcase", "poll", "results", "staff/login", "usher", "admin/login", "admin"]);

// Invitation links: /invite/<token>. The token is checked by the server.
const INVITE = /^invite\/[A-Za-z0-9_-]{1,100}$/;

function readPath() {
  const name = window.location.pathname.replace(/^\/+|\/+$/g, "");
  return ROUTES.has(name) || INVITE.test(name) ? name : "";
}

// Tiny history router: real URLs (/usher, /admin) without a dependency.
export default function useRoute() {
  const [route, setRoute] = useState(readPath);

  useEffect(() => {
    const onPop = () => setRoute(readPath());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = useCallback((to, { replace = false } = {}) => {
    const url = `/${to}`;
    if (replace) window.history.replaceState(null, "", url);
    else window.history.pushState(null, "", url);
    setRoute(readPath());
    window.scrollTo(0, 0);
  }, []);

  return [route, navigate];
}
