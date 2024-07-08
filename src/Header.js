import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const Header = () => {
  return (
    <header className="header">
      <div className="left-section">
        <img src="logo.svg" alt="Logo" className="logo" />
        <span className="title">educity quran</span>
      </div>
      <nav className="right-section">
        <Link to="/home" className="nav-item">Home</Link>
        <Link to="/quran" className="nav-item">The Holy Quran</Link>
      </nav>
    </header>
  );
};

export default Header;
