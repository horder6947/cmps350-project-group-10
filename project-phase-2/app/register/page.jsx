"use client";

import Link from "next/link";
import { useState } from "react";
import TopNav from "@/app/components/TopNav";
import { writeSession } from "@/lib/session";

export default function Page() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || `Register failed (${res.status})`);
        return;
      }
      writeSession(json.user);
      window.location.href = "/feed";
    } catch (err) {
      setError(err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-page-bg">
      <TopNav activePath="/register" />
      <main className="page container auth-page register-page">
        <div className="left-side">
          <h1>Create your account</h1>
          <p>Register to start posting and using the social feed.</p>
        </div>

        <section className="card">
          <div className="badge">Register</div>
          <h2>Sign up</h2>

          <form onSubmit={onSubmit}>
            <div>
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                className="input-field"
                required
                placeholder="your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="input-field"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="input-field"
                required
                minLength={6}
                placeholder="at least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error ? (
              <p className="error-visible">{error}</p>
            ) : (
              <p className="error-visible" />
            )}
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Creating…" : "Create account"}
            </button>
          </form>

          <p className="small-text">
            Already have an account? <Link href="/login">Login</Link>
          </p>
        </section>
      </main>
    </div>
  );
}
