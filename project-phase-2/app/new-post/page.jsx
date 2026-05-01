import Link from "next/link";
import TopNav from "@/app/components/TopNav";
export default async function Page() {
  return (
    <>
      <TopNav activePath="/new-post" />
      <main className="container composer-layout">
        <section className="card composer-card">
          <header className="composer-header">
            <h2>Create a New Post</h2>
            <p>Share an update with your network.</p>
          </header>

          <form id="new-post-form" className="composer-form">
            <div className="field-group">
              <label htmlFor="post-content">Post content</label>
              <textarea
                id="post-content"
                className="input-field"
                rows={7}
                maxLength={500}
                placeholder="What do you want to share?"
              />
            </div>

            <div className="action-row">
              <button type="submit" id="publish-btn" className="btn">
                Publish Post
              </button>
              <Link href="/feed" className="btn cancel-btn">
                Cancel
              </Link>
            </div>
          </form>

          <p id="new-post-message" className="status-text" aria-live="polite" />
        </section>
      </main>
    </>
  );
}
