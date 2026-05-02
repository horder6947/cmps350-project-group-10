"use client";

import { useEffect, useState } from "react";
import TopNav from "@/app/components/TopNav";
import "./statistics.css";

const TOP_OPTIONS = [3, 5, 10];

export default function StatisticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [topN, setTopN] = useState(5);

  useEffect(() => {
    let mounted = true;

    async function loadStats() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/statistics?top=${topN}`);
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
  }, [topN]);

  return (
    <>
      <TopNav activePath="/statistics" />
      <main className="container statistics-page">
        {isLoading && (
          <>
            <h2>Platform statistics</h2>
            <br />
            <p className="statistics-status">Loading statistics…</p>
          </>
        )}
        {error && (
          <>
            <h2>Platform statistics</h2>
            <br />
            <p className="statistics-status">Unable to load statistics: {error}</p>
          </>
        )}
        {!isLoading && !error && !data && (
          <>
            <h2>Platform statistics</h2>
            <br />
            <p className="statistics-status">No data.</p>
          </>
        )}
        {!isLoading && !error && data && (
          <>
            <h2>Platform statistics</h2>
            <br />

            <div className="statistics-grid">
              <section className="card statistics-card">
                <h3 className="statistics-card-title">Average followers per user</h3>
                <p className="statistics-value">{data.averageFollowersPerUser}</p>
                <p className="statistics-meta">
                  Total followers: {data.totalFollowers} · Users: {data.totalUsers}
                </p>
              </section>

              <section className="card statistics-card">
                <h3 className="statistics-card-title">
                  Avg. followers (total follows ÷ users)
                </h3>
                <p className="statistics-value">{data.averageFollowersPerUserTotals}</p>
              </section>

              <section className="card statistics-card">
                <h3 className="statistics-card-title">Average posts per user</h3>
                <p className="statistics-value">{data.averagePostsPerUser}</p>
              </section>

              <section className="card statistics-card">
                <h3 className="statistics-card-title">Average likes per post</h3>
                <p className="statistics-value">{data.averageLikesPerPost}</p>
              </section>

              <section className="card statistics-card">
                <h3 className="statistics-card-title">Average comments per post</h3>
                <p className="statistics-value">{data.averageCommentsPerPost}</p>
              </section>

              <section className="card statistics-card">
                <h3 className="statistics-card-title">New users (last 30 days)</h3>
                <p className="statistics-value">{data.newUsersCount}</p>
              </section>
            </div>

            <section className="card statistics-wide">
              <div className="statistics-toolbar">
                <h3 className="statistics-section-heading">Most liked posts</h3>
                <label className="statistics-top-label" htmlFor="top-n">
                  Top{" "}
                  <select
                    id="top-n"
                    className="statistics-select"
                    value={topN}
                    onChange={(e) => setTopN(Number(e.target.value))}
                  >
                    {TOP_OPTIONS.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <ol className="statistics-post-list">
                {(data.topLikedPosts ?? []).length === 0 ? (
                  <li className="statistics-post-empty">No posts yet.</li>
                ) : (
                  data.topLikedPosts.map((post, i) => (
                    <li key={post.id} className="statistics-post-item">
                      <span className="statistics-post-rank">{i + 1}.</span>
                      <div>
                        <p className="statistics-post-body">{post.post_content}</p>
                        <p className="statistics-meta">
                          @{post.author?.username} · {post.likesCount} likes
                        </p>
                      </div>
                    </li>
                  ))
                )}
              </ol>
            </section>
          </>
        )}
      </main>
    </>
  );
}
