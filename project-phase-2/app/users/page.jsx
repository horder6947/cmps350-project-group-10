import TopNav from "@/app/components/TopNav";

export default async function Page() {
  return (
    <>
      <TopNav activePath="/users" />
      <main className="container">
        <h2>Discover Users</h2>
        <br />

        <section id="users-container" className="users-grid">
          <article className="card user-card">
            <div className="user-header">
              <div className="user-avatar" />
              <div className="user-info">
                <h3 className="user-username" />
                <p className="user-userid">@</p>
              </div>
            </div>
            <div className="user-bio" />
            <div className="user-stats">
              <div className="user-stat">
                <span className="user-stat-value">0</span>
                <span className="user-stat-label">Followers</span>
              </div>
              <div className="user-stat">
                <span className="user-stat-value">0</span>
                <span className="user-stat-label">Following</span>
              </div>
              <div className="user-stat">
                <span className="user-stat-value">0</span>
                <span className="user-stat-label">Posts</span>
              </div>
            </div>
            <div className="user-actions">
              <button type="button" className="btn btn-follow">
                Follow
              </button>
            </div>
          </article>
        </section>
      </main>
    </>
  );
}
