import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faSearch } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';
import img1 from '../../Images/1Girl.jpg';

const Navbar = ({ user, onProfileClick, onSearch, searchQuery }) => (
  <nav className="top-navbar">
    <div className="navbar-left">
      <h1 className="app-logo">Recepito</h1>
      <div className="search-container">
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <input
          type="text"
          placeholder="Search recipes..."
          className="search-input"
          value={searchQuery || ''}
          onChange={onSearch}
        />
      </div>
    </div>
    <div className="navbar-right">
      <button className="nav-button"><FontAwesomeIcon icon={faBell} /></button>
      <button className="nav-button" onClick={onProfileClick}>
        <img src={user?.avatar || user?.img || img1} alt="Profile" className="profile-avatar" />
      </button>
    </div>
  </nav>
);

export default Navbar; 