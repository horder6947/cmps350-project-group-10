import Link from "next/link";

export default async function Page() {
  return (
    <div className="register-page-bg">
      <main className="page container auth-page register-page">
        <div className="left-side">
          <h1>Create your account</h1>
          <p>Register to start posting and using the social feed.</p>
        </div>

        <section className="card">
          <div className="badge">Register</div>
          <h2>Sign up</h2>

          <form>
            <div>
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                className="input-field"
                required
                placeholder="your name"
              />
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="input-field"
                required
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="input-field"
                required
                minLength={6}
                placeholder="at least 6 characters"
              />
            </div>

            <p className="error-visible" />
            <button type="submit" className="btn">
              Create account
            </button>
          </form>

          <p className="small-text">
            Already have an account? <Link href="/login">Login</Link>
          </p>
        </section>
      </main>
    </div>
  );
}
