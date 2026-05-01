"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/users", label: "Discover" },
  { href: "/feed", label: "Feed" },
  { href: "/new-post", label: "New post" },
  { href: "/profile", label: "Profile" },
];

export default function TopNav({ activePath }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    window.localStorage.setItem("theme", next);
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
          <Link href="/login">Log out</Link>
        </div>
      </div>
    </nav>
  );
}
