import './App.css';
import React, { useState } from 'react';
import Login from './Components/UserInfo/Login';
import Regestration from './Components/UserInfo/Regestration';
import Profilee from './Components/ProfilePage/Profilee';
import Fyp from './Components/FYP/Fyp';
import NewPost from './Components/NewPost/NewPost';

function App() {
  const [users, setUsers] = useState([
    { Username: "Mario", Email: "Mario@gmail.com", Password: "123",posts: [
      { image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&h=120", recipe: "This is the recipe for image #1." },
  ]},
    { Username: "Mariam", Email: "Mario@gmail.com", Password: "123" ,posts: [
      { image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&h=120", recipe: "This is the recipe for image #1." },
     
    ]}
  ]);
  const [page, setPage] = useState("login");
  const [currentUser, setCurrentUser] = useState(null);

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
    setPage("fyp");
  };


  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setPage("fyp");
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

  

  return (
    <>
      {page === "login" && (
        <Login
          users={users}
          goToRegister={() => setPage("register")}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {page === "register" && (
        <Regestration
          add={adduser}
          goToLogin={() => setPage("login")}
        />
      )}
      {page === "profile" && currentUser && (
        <Profilee user={currentUser} goToHome={() => setPage("fyp")} updateUser={updateUser}/>
      )}
      {page === "fyp" && currentUser && (
        <Fyp
          user={currentUser}
          goToProfile={() => setPage("profile")}
          goToPlus={() => setPage("newpost")}
          goToHome={() => setPage("fyp")}
        />
      )}
       {page === "newpost" && currentUser && (
        <NewPost
          user={currentUser}
          onAdd={addPost}
          onCancel={() => setPage("newpost")}
        />
      )}
    </>
  );
}

export default App;
