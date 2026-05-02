"use client";

import { useEffect, useState } from "react";
import TopNav from "@/app/components/TopNav";
import { readSession } from "@/lib/session";

function formatTime(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return "";
  }
}

export default function MyPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const session = readSession();
    if (!session?.id) {
      window.location.href = "/login";
      return;
    }

    let cancelled = false;
    async function run() {
      try {
        const res = await fetch(`/api/posts?authorId=${encodeURIComponent(session.id)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled) setPosts(json.posts ?? []);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load posts");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <TopNav activePath="/my-posts" />
      <main className="container">
        <h2>My posts</h2>
        <br />
        {loading ? <p className="status-text">Loading…</p> : null}
        {error ? <p className="error-visible">{error}</p> : null}
        {!loading && !error && posts.length === 0 ? (
          <p className="status-text">You have no posts yet.</p>
        ) : null}
        <section>
          {posts.map((post) => (
            <article key={post.id} className="card post-card">
              <header className="post-header">
                <span className="post-time">{formatTime(post.date_created)}</span>
              </header>
              <div className="post-content">
                <p>{post.post_content}</p>
              </div>
              <footer className="post-actions">
                <button type="button" className="btn like-btn">
                  Like ({post.likesCount ?? 0})
                </button>
                <button type="button" className="btn comment-btn">
                  Comment ({post.commentsCount ?? 0})
                </button>
              </footer>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
