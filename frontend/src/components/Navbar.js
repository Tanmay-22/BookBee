import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth, useTheme } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark retro-navbar">
      <div className="container-fluid px-2">
        <Link to="/" className="navbar-brand fw-bold retro-title">📚 BOOKBEE</Link>
        <div className="navbar-nav ms-auto d-flex flex-row">
          <button onClick={toggleTheme} className="btn btn-link nav-link">
            {isDark ? '☀️' : '🌙'}
          </button>
          {user ? (
            <>
              <Link to="/" className="nav-link">Books</Link>
              <span className="nav-link">Hi, {user.name}</span>
              <button onClick={logout} className="btn btn-link nav-link">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-link">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;