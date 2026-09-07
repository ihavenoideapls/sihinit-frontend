import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <h2 className="logo">AuditVault</h2>

      <div className="nav-links">
        <a href="#features">Features</a>
        <a href="#security">Security</a>
        <a href="#about">About</a>

        <button
          type="button"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>
    </nav>
  );
}

export default Navbar;