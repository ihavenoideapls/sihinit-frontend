function SecurityCard() {
  return (
    <div className="security-card">

      <div className="card-header">
        <span>●</span>
        SYSTEM STATUS
      </div>

      <h2>Audit Integrity</h2>

      <div className="verified">
        ✓ VERIFIED
      </div>

      <p>
        Your audit records are protected
        against unauthorized modification.
      </p>

    </div>
  );
}

export default SecurityCard;