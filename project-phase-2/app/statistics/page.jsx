"use client";

import { useEffect, useState } from "react";
import TopNav from "@/app/components/TopNav";
import "./statistics.css";

function truncate(text, max = 120) {
  if (!text) return "";
  const t = text.trim();
  return t.length <= max ? t : `${t.slice(0, max)}…`;
}

function StatisticsDashboard({ data }) {
  const topPosts = data?.topPosts ?? [];

  return (
    <>
      <section className="card statistics-card">
        <h3 className="statistics-card-title">Key metrics</h3>
        <div className="stats statistics-stats-row">
          <div className="stat">
            <p>{data?.averageFollowersPerUser ?? "0"}</p>
            <span>Avg. followers / user</span>
          </div>
          <div className="stat">
            <p>{data?.averagePostsPerUser ?? "0"}</p>
            <span>Avg. posts / user</span>
          </div>
          <div className="stat">
            <p>{data?.averageLikesPerPost ?? "0"}</p>
            <span>Avg. likes / post</span>
          </div>
          <div className="stat">
            <p>{data?.averageCommentsPerPost ?? "0"}</p>
            <span>Avg. comments / post</span>
          </div>
        </div>
        <div className="stats statistics-stats-row statistics-stats-secondary">
          <div className="stat">
            <p>{data?.totalFollowers ?? 0}</p>
            <span>Total follow relationships</span>
          </div>
          <div className="stat">
            <p>{data?.totalUsers ?? 0}</p>
            <span>Registered users</span>
          </div>
          <div className="stat">
            <p>{data?.newUsersThisMonth ?? 0}</p>
            <span>New users (30 days)</span>
          </div>
        </div>
      </section>

      <section className="card statistics-card">
        <h3 className="statistics-card-title">Top liked posts</h3>
        {topPosts.length === 0 ? (
          <p className="statistics-empty">No posts yet.</p>
        ) : (
          <ul className="statistics-top-posts">
            {topPosts.map((post) => (
              <li key={post.id}>
                <div className="statistics-post-meta">
                  <strong className="statistics-author">
                    @{post.author?.username ?? "unknown"}
                  </strong>
                  <span>
                    {post.likesCount ?? 0} likes · {post.commentsCount ?? 0}{" "}
                    comments
                  </span>
                </div>
                <p className="statistics-post-snippet">
                  {truncate(post.post_content)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

export default function StatisticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadStats() {
      try {
        const res = await fetch("/api/statistics");
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

  if (isLoading) {
    return (
      <>
        <TopNav activePath="/statistics" />
        <main className="container">
          <p className="statistics-status">Loading statistics…</p>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <TopNav activePath="/statistics" />
        <main className="container">
          <p className="statistics-status statistics-error">
            Unable to load statistics: {error}
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <TopNav activePath="/statistics" />
      <main className="container">
        <h2>Statistics</h2>
        <p className="statistics-lead">
          Overview of activity across the platform.
        </p>

        <StatisticsDashboard data={data} />
      </main>
    </>
  );
}
