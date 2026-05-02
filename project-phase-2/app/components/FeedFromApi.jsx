"use client";

import { useEffect, useState } from "react";
import { readSession } from "@/lib/session";

function formatTime(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return "";
  }
}

export default function FeedFromApi() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const session = readSession();

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        if (!session?.id) {
          if (!cancelled) {
            setPosts([]);
            setLoading(false);
          }
          return;
        }
        const url = `/api/posts?viewerId=${encodeURIComponent(session.id)}&followingOnly=1`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled) setPosts(json.posts ?? []);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load feed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [session?.id]);

  async function onLike(postId, currentLikes, likedByMe) {
    if (!session?.id) {
      setError("Please log in to like posts.");
      return;
    }
    const action = likedByMe ? "unlike" : "like";
    try {
      const res = await fetch(`/api/posts/${postId}/likes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.id, action }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || `Like failed (${res.status})`);
        return;
      }
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                likesCount:
                  json.likesCount ??
                  (likedByMe
                    ? Math.max(currentLikes - 1, 0)
                    : currentLikes + 1),
                likedByMe: !likedByMe,
              }
            : p,
        ),
      );
    } catch (err) {
      setError(err.message || "Like failed");
    }
  }

  async function onComment(postId, currentCount) {
    if (!session?.id) {
      setError("Please log in to comment.");
      return;
    }
    const text = window.prompt("Write your comment:");
    if (!text || !text.trim()) return;
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorId: session.id, comment: text.trim() }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || `Comment failed (${res.status})`);
        return;
      }
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, commentsCount: json.commentsCount ?? currentCount + 1 }
            : p,
        ),
      );
    } catch (err) {
      setError(err.message || "Comment failed");
    }
  }

  if (loading) return <p className="status-text">Loading posts…</p>;
  if (error) return <p className="error-visible">{error}</p>;
  if (!session?.id) {
    return (
      <p className="status-text">Log in to see posts from people you follow.</p>
    );
  }
  if (posts.length === 0) {
    return <p className="status-text">No posts from followed users yet.</p>;
  }

  return posts.map((post) => (
    <article key={post.id} className="card post-card">
      <header className="post-header">
        <span className="post-author">
          @{post.author?.username ?? "unknown"}
        </span>
        <span className="post-time">{formatTime(post.date_created)}</span>
      </header>
      <div className="post-content">
        <p>{post.post_content}</p>
      </div>
      <footer className="post-actions">
        <button
          type="button"
          className="btn like-btn"
          onClick={() =>
            onLike(post.id, post.likesCount ?? 0, !!post.likedByMe)
          }
        >
          {post.likedByMe ? "Unlike" : "Like"} ({post.likesCount ?? 0})
        </button>
        <button
          type="button"
          className="btn comment-btn"
          onClick={() => onComment(post.id, post.commentsCount ?? 0)}
        >
          Comment ({post.commentsCount ?? 0})
        </button>
      </footer>
    </article>
  ));
}
