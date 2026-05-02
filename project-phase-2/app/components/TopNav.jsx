"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearSession, readSession } from "@/lib/session";

const navItems = [
  { href: "/users", label: "Discover" },
  { href: "/feed", label: "Feed" },
  { href: "/statistics", label: "Statistics" },
  { href: "/my-posts", label: "My posts" },
  { href: "/new-post", label: "New post" },
  { href: "/profile", label: "Profile" },
];

export default function TopNav({ activePath }) {
  const [theme, setTheme] = useState("light");
  const [session, setSession] = useState(null);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
    setSession(readSession());
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    window.localStorage.setItem("theme", next);
  }

  function logout() {
    clearSession();
    setSession(null);
    window.location.href = "/login";
  }

  return (
    <nav className="top-nav">
      <div className="nav-container">
        <Link className="nav-logo" href="/feed">
          <img src="/chirp-logo.png" alt="Chirp" className="nav-logo-img" />
          Chirp
        </Link>
        <div className="nav-links">
          <button
            type="button"
            className="theme-toggle"
            id="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={activePath === item.href ? "active" : ""}
            >
              {item.label}
            </Link>
          ))}
          {session ? (
            <button type="button" className="nav-logout" onClick={logout}>
              Log out
            </button>
          ) : (
            <Link href="/login">Log in</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
