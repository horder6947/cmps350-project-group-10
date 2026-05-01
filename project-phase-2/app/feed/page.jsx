import Link from "next/link";
import TopNav from "@/app/components/TopNav";

export default async function Page() {
  return (
    <>
      <TopNav activePath="/feed" />
      <main className="container">
        <h2>Your News Feed</h2>
        <br />
        <section id="feed-container">
          <article className="card post-card">
            <header className="post-header">
              <Link href="/profile" className="post-author">
                @
              </Link>
              <span className="post-time" />
            </header>
            <div className="post-content">
              <p />
            </div>
            <footer className="post-actions">
              <button type="button" className="btn like-btn">
                Like (0)
              </button>
              <button type="button" className="btn comment-btn">
                Comment (0)
              </button>
            </footer>
          </article>
        </section>
      </main>
    </>
  );
}
