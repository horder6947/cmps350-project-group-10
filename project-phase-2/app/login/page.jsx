"use client";

import Link from "next/link";
import { useState } from "react";
import TopNav from "@/app/components/TopNav";
import { writeSession } from "@/lib/session";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || `Login failed (${res.status})`);
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
    <div className="login-page">
      <TopNav activePath="/login" />
      <main className="page container auth-page">
        <div className="left-side">
          <h1>Sign in to your platform</h1>
          <p>
            Log in with your account to view and post on the social feed page
            created for this project.
          </p>
        </div>

        <section className="card box auth-card">
          <div className="badge">Login</div>
          <h2 className="signin-title">Sign in</h2>
          <form onSubmit={onSubmit}>
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Logging in…" : "Login"}
            </button>
          </form>
          <p className="signup-hint helper-text">
            If you don&apos;t have an account,{" "}
            <Link href="/register">register here</Link>.
          </p>
          {error ? (
            <p className="error-visible">{error}</p>
          ) : (
            <p className="error-visible" />
          )}
        </section>
      </main>
    </div>
  );
}
