import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const links = [
    { path: '/', label: 'Home' },
    { path: '/upload', label: 'Upload' },
    { path: '/search', label: 'Search' },
    { path: '/about', label: 'About' },
  ];

  return (
    <nav className="navbar">
      <button className="nav-brand" onClick={() => navigate('/')}>
        <img src="/images/logo.jpg" alt="Diffi logo" />
        <h1>Diffi</h1>
      </button>
      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        {links.map(link => (
          <li key={link.path}>
            <button
              className={location.pathname === link.path ? 'active' : ''}
              onClick={() => { navigate(link.path); setMenuOpen(false); }}
            >
              {link.label}
            </button>
          </li>
        ))}
      </ul>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
        </button>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
