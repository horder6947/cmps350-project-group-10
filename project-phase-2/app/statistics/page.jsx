"use client";

import React, { useEffect, useState } from "react";
import "./statistics.css";

// Simple page that shows the average number of followers per user.
// Kept minimal on purpose: fetches one endpoint and renders a single card.
export default function StatisticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadStats() {
      try {
        const res = await fetch("/api/statistics/average-followers");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (mounted) setData(json);
      } catch (err) {
        if (mounted) setError(err.message || String(err));
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadStats();
    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) return <div className="stats-container">Loading statistics…</div>;
  if (error)
    return <div className="stats-container">Unable to load statistics: {error}</div>;

  const avg = data?.averageFollowersPerUser ?? "0.00";
  const totalFollowers = data?.totalFollowers ?? 0;
  const totalUsers = data?.totalUsers ?? 0;

  return (
    <main className="stats-container">
      <h1>Platform Statistics</h1>

      <section className="stat-card" aria-live="polite">
        <h2>Average Followers Per User</h2>
        <p className="stat-value">{avg}</p>
        <p className="stat-meta">Total followers: {totalFollowers}</p>
        <p className="stat-meta">Total users: {totalUsers}</p>
      </section>
    </main>
  );
}
