import Link from "next/link";
import TopNav from "@/app/components/TopNav";

export default async function Page() {
  return (
    <div className="login-page">
      <TopNav activePath="/login" />
      <main className="page container auth-page">
        <div className="left-side">
          <h1>Sign in to your platform</h1>
          <p>
            Log in with your account to view and post on the social feed page
            created for this project.
          </p>
        </div>

        <section className="card box auth-card">
          <div className="badge">Login</div>
          <h2 className="signin-title">Sign in</h2>
          <form>
            <div>
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" className="input-field" />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="input-field"
              />
            </div>

            <button type="submit" className="btn">
              Login
            </button>
          </form>
          <p className="signup-hint helper-text">
            If you don&apos;t have an account,{" "}
            <Link href="/register">register here</Link>.
          </p>
          <p className="error-visible" />
        </section>
      </main>
    </div>
  );
}
