import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom"; // ✅ Added useLocation
import { logOut } from "../authService";
import "./Navbar.css";

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  const handleSignOut = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-logo">
        <img src="/logo.png" alt="ThinkFlix Logo" className="navbar-logo" />
      </NavLink>

      <div className="nav-links">
        {user && (
          <>
            <NavLink to="/generate" className="nav-link">Generate</NavLink>
            <NavLink to="/library" className="nav-link">Library</NavLink>
            <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
          </>
        )}
        {!isLandingPage && ( // ✅ Only show on non-landing pages
          <NavLink to="/pricing" className="nav-link">Pricing</NavLink>
        )}
      </div>

      <div className="nav-auth">
        {user ? (
          <>
            <span className="nav-user">👤 {user.displayName}</span>
            <button className="sign-out-btn" onClick={handleSignOut}>
              Sign Out
            </button>
          </>
        ) : (
          <NavLink to="/login" className="sign-in-link">Login</NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
