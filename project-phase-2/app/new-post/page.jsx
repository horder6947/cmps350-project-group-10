"use client";

import Link from "next/link";
import { useState } from "react";
import TopNav from "@/app/components/TopNav";
import { readSession } from "@/lib/session";

export default function Page() {
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    const session = readSession();
    if (!session?.id) {
      setMessage("Please log in first.");
      return;
    }
    if (!content.trim()) {
      setMessage("Post content is required.");
      return;
    }

    setMessage("");
    setLoading(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: session.id,
          post_content: content.trim(),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage(json.error || `Failed to publish (${res.status})`);
        return;
      }
      setContent("");
      setMessage("Post published.");
      window.location.href = "/feed";
    } catch (err) {
      setMessage(err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <TopNav activePath="/new-post" />
      <main className="container composer-layout">
        <section className="card composer-card">
          <header className="composer-header">
            <h2>Create a New Post</h2>
            <p>Share an update with your network.</p>
          </header>

          <form
            id="new-post-form"
            className="composer-form"
            onSubmit={onSubmit}
          >
            <div className="field-group">
              <label htmlFor="post-content">Post content</label>
              <textarea
                id="post-content"
                className="input-field"
                rows={7}
                maxLength={500}
                placeholder="What do you want to share?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="action-row">
              <button
                type="submit"
                id="publish-btn"
                className="btn"
                disabled={loading}
              >
                {loading ? "Publishing…" : "Publish Post"}
              </button>
              <Link href="/feed" className="btn cancel-btn">
                Cancel
              </Link>
            </div>
          </form>

          <p id="new-post-message" className="status-text" aria-live="polite">
            {message}
          </p>
        </section>
      </main>
    </>
  );
}
