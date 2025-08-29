import React from 'react';
import { Link } from 'react-router-dom';
import "./Header.css";
function Header() {
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <img src="images/logo.png" alt="Logo" />
        </Link>
        
        <nav className="nav-links">
          <Link to="/">Home</Link>
          
          <Link to={isAdmin ? "/admin" : "/emotion"}>
            {isAdmin ? "Add Recommendations" : "Detect Emotion"}
          </Link>
          
          <Link to={isAdmin ? "/admin" : "/faq"}>
            FAQ
          </Link>
          
          {!isAdmin && (
            <Link to="/uploads">My Uploads</Link>
          )}
          
          {user ? (
            <div className="user-section">
              <span>Welcome, {user.name}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;