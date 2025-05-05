import React from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './Layout.css';

const Layout = ({ children, user, onProfileClick, onSearch, searchQuery }) => (
  <div className="app-layout">
    <Navbar user={user} onProfileClick={onProfileClick} onSearch={onSearch} searchQuery={searchQuery} />
    <main className="main-content">
      {children}
    </main>
    <Footer />
  </div>
);

export default Layout; 