"use client";

import { useEffect, useState } from "react";
import TopNav from "@/app/components/TopNav";
import { readSession } from "@/lib/session";

export default function Page() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const session = readSession();

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const url = session?.id
          ? `/api/users?viewerId=${encodeURIComponent(session.id)}`
          : "/api/users";
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled) {
          const filtered = (json.users ?? []).filter(
            (u) => u.id !== session?.id,
          );
          setUsers(filtered);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load users");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [session?.id]);

  async function toggleFollow(userId, isFollowing) {
    if (!session?.id) {
      setError("Please log in to follow users.");
      return;
    }
    try {
      const res = isFollowing
        ? await fetch(
            `/api/follows?followerId=${encodeURIComponent(session.id)}&followeeId=${encodeURIComponent(userId)}`,
            { method: "DELETE" },
          )
        : await fetch("/api/follows", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              followerId: session.id,
              followeeId: userId,
            }),
          });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || `Follow action failed (${res.status})`);
        return;
      }
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                isFollowing: !isFollowing,
                followersCount: json.followersCount ?? u.followersCount,
              }
            : u,
        ),
      );
    } catch (err) {
      setError(err.message || "Follow action failed");
    }
  }

  return (
    <>
      <TopNav activePath="/users" />
      <main className="container">
        <h2>Discover Users</h2>
        <br />
        {loading ? <p className="status-text">Loading users…</p> : null}
        {error ? <p className="error-visible">{error}</p> : null}

        <section id="users-container" className="users-grid">
          {users.map((user) => (
            <article key={user.id} className="card user-card">
              <div className="user-header">
                <div className="user-avatar">{(user.username || "U")[0]}</div>
                <div className="user-info">
                  <h3 className="user-username">{user.username}</h3>
                  <p className="user-userid">@{user.id}</p>
                </div>
              </div>
              <div className="user-bio">{user.bio}</div>
              <div className="user-stats">
                <div className="user-stat">
                  <span className="user-stat-value">
                    {user.followersCount ?? 0}
                  </span>
                  <span className="user-stat-label">Followers</span>
                </div>
                <div className="user-stat">
                  <span className="user-stat-value">
                    {user.followingCount ?? 0}
                  </span>
                  <span className="user-stat-label">Following</span>
                </div>
                <div className="user-stat">
                  <span className="user-stat-value">
                    {user.postsCount ?? 0}
                  </span>
                  <span className="user-stat-label">Posts</span>
                </div>
              </div>
              <div className="user-actions">
                <button
                  type="button"
                  className={`btn ${user.isFollowing ? "btn-unfollow" : "btn-follow"}`}
                  onClick={() => toggleFollow(user.id, !!user.isFollowing)}
                >
                  {user.isFollowing ? "Unfollow" : "Follow"}
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
