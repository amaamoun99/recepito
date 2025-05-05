import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Components/Layout/Layout';
import Login from './Components/UserInfo/Login';
import Regestration from './Components/UserInfo/Regestration';
import Profilee from './Components/ProfilePage/Profilee';
import Fyp from './Components/FYP/Fyp';
import NewPost from './Components/NewPost/NewPost';

function App() {
  const [users, setUsers] = useState([
    {
      Username: "Mario",
      Email: "Mario@gmail.com",
      Password: "123",
      posts: [
        {
          image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&h=120",
          recipe: "This is the recipe for image #1."
        },
      ]
    },
    {
      Username: "Mariam",
      Email: "Mario@gmail.com",
      Password: "123",
      posts: [
        {
          image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&h=120",
          recipe: "This is the recipe for image #1."
        }
      ]
    }
  ]);

  const [currentUser, setCurrentUser] = useState(null);
  const [viewedUser, setViewedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const adduser = (newu) => {
    setUsers([...users, newu]);
  };

  const addPost = (post) => {
    setUsers(users => {
      const updatedUsers = users.map(u =>
        u.Username === currentUser.Username
          ? { ...u, posts: [...(u.posts || []), post] }
          : u
      );
      const updatedCurrentUser = updatedUsers.find(u => u.Username === currentUser.Username);
      setCurrentUser(updatedCurrentUser);
      return updatedUsers;
    });
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const updateUser = (updatedUser) => {
    setUsers(users => {
      const updatedUsers = users.map(u =>
        u.Username === currentUser.Username ? updatedUser : u
      );
      setCurrentUser(updatedUser);
      return updatedUsers;
    });
  };

  const goToUserProfile = (username) => {
    const user = users.find(u => u.Username === username);
    if (user) {
      setViewedUser(user);
    }
  };

  // Navbar handlers
  const handleProfileClick = () => {
    // Navigate to profile page
    window.location.pathname = '/profile';
  };
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Router>
      <Layout
        user={currentUser}
        onProfileClick={handleProfileClick}
        onSearch={handleSearch}
        searchQuery={searchQuery}
      >
        <Routes>
          <Route path="/" element={
            <Fyp
              user={currentUser}
              goToProfile={handleProfileClick}
              goToPlus={() => window.location.pathname = '/newpost'}
              goToHome={() => window.location.pathname = '/'}
              goToUserProfile={goToUserProfile}
            />
          } />
          <Route path="/login" element={
            <Login
              users={users}
              goToRegister={() => window.location.pathname = '/register'}
              onLoginSuccess={handleLoginSuccess}
            />
          } />
          <Route path="/register" element={
            <Regestration
              add={adduser}
              goToLogin={() => window.location.pathname = '/login'}
            />
          } />
          <Route path="/profile" element={
            <Profilee
                  user={currentUser}
                  goToHome={() => window.location.pathname = '/'}
                  updateUser={updateUser}
                />
              
          } />
          <Route path="/newpost" element={
            <NewPost
              user={currentUser}
              onAdd={addPost}
              onCancel={() => window.location.pathname = '/'}
            />
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
