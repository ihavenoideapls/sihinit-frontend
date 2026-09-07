import SecurityCard from "./SecurityCard";

function Hero() {
  return (
    <main className="hero">

      <div className="hero-content">

        <p className="eyebrow">
          SECURE AUDIT TRAILS
        </p>

        <h1>
          Trust every action.
          <br />
          <span>Verify every event.</span>
        </h1>

        <p className="description">
          AuditVault records, protects, and verifies
          critical activity across your systems.
        </p>

        <div className="buttons">
          <button className="primary-btn">
            Get Started →
          </button>

          <button className="secondary-btn">
            Learn More
          </button>
        </div>

      </div>

      <SecurityCard />

    </main>
  );
}

export default Hero;