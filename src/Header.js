import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import logo from './assets/alameducity.png';

const Header = () => {
  return (
    <header className="header">
      <div className="left-section">
        <img src={logo} alt="alameducity.com" width="100" height="100" />
        <br/>
        <span className="tagline">Learn, Excel & Enlighten</span>
      </div>
      <nav className="right-section">
        <Link to="/home" className="nav-item">Settings</Link>
        <Link to="/quran" className="nav-item">The Holy Quran</Link>
        <Link to="/read" className="nav-item">Read Quran</Link>
      </nav>
    </header>
  );
};

export default Header;
