import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import logo from './assets/alameducity.png';

const Header = () => {
  return (
    <header className="header">
      <div className="left-section">
        <img src={{logo}} alt="alameducity.com" width="200" height="60" />
        <span className="title">alameducity.com</span>
      </div>
      <nav className="right-section">
        <Link to="/home" className="nav-item">Home</Link>
        <Link to="/quran" className="nav-item">The Holy Quran</Link>
      </nav>
    </header>
  );
};

export default Header;
