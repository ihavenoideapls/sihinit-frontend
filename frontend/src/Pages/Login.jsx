function Login() {
  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          <div className="logo-icon">✓</div>
          <h1>AuditVault</h1>
        </div>

        <p className="login-subtitle">
          Secure access to your audit environment
        </p>

        <form className="login-form">

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="login-options">
            <label className="remember">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>

            <a href="#forgot">Forgot password?</a>
          </div>

          <button type="submit" className="login-submit">
            Sign In →
          </button>

        </form>

        <div className="security-notice">
          <span>🔒</span>
          <p>
            Your connection is protected with secure authentication.
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;