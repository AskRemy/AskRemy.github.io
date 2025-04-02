import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // You'll create this CSS file for styling

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo-container">
          <img 
                src="/assets/rat_img.jpg" 
                alt="Rat logo" 
                className="logo-image" 
          />
          <Link to="/" className="logo-link">

            <h1>AskRemy</h1>
            <p className="tagline">Your Interactive Recipe Assistant</p>
          </Link>
        </div>
        
        {/* <nav className="main-nav">
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </nav> */}
        
        {/* <div className="user-actions">
          <button className="btn-theme">
            <span className="icon">🌙</span>
          </button>
          <button className="btn-settings">
            <span className="icon">⚙️</span>
          </button>
        </div> */}
      </div>
    </header>
  );
};

export default Header;