import React, { useState } from "react";
import './Fyp.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHeart, 
  faComment, 
  faShare, 
  faUser, 
  faSearch, 
  faTimes,
  faHome,
  faPlus,
  faBell,
  faBookmark,
  faEllipsisH
} from '@fortawesome/free-solid-svg-icons';


// Sidebar Component
const Sidebar = ({ onHome, onSearch, onCreate, onProfile }) => {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <button className="sidebar-item" onClick={onHome}>
          <FontAwesomeIcon icon={faHome} />
          <span>Home</span>
        </button>
        <button className="sidebar-item" onClick={onSearch}>
          <FontAwesomeIcon icon={faSearch} />
          <span>Search</span>
        </button>
        <button className="sidebar-item create-button" onClick={onCreate}>
          <FontAwesomeIcon icon={faPlus} />
          <span>Create Recipe</span>
        </button>
        <button className="sidebar-item" onClick={onProfile}>
          <FontAwesomeIcon icon={faUser} />
          <span>Profile</span>
        </button>
      </nav>
    </aside>
  );
};

// RecipePostCard Component
const RecipePostCard = ({ post, user, onLike, onComment, onShare, onUserClick }) => {
  return (
    <div className="recipe-card">
      <div className="card-header">
        <div className="user-info" onClick={(e) => onUserClick(e, post.user)}>
          <img src={post.img} alt={post.user} className="user-avatar" />
          <div>
            <div className="username">{post.user}</div>
            <div className="location">{post.location}</div>
          </div>
        </div>
        <button className="menu-button">
          <FontAwesomeIcon icon={faEllipsisH} />
        </button>
      </div>
      
      <img src={post.img} alt="Recipe" className="recipe-image" />
      
      <div className="card-actions">
        <div className="action-buttons">
          <button 
            className={`like-button ${post.likedBy.includes(user?.username) ? 'liked' : ''}`}
            onClick={(e) => onLike(post.id, e)}
          >
            <FontAwesomeIcon icon={faHeart} />
            <span>{post.likes}</span>
          </button>
          <button className="comment-button" onClick={() => onComment(post.id)}>
            <FontAwesomeIcon icon={faComment} />
            <span>{post.comments}</span>
          </button>
          <button className="share-button" onClick={() => onShare(post.id)}>
            <FontAwesomeIcon icon={faShare} />
            <span>{post.shares}</span>
          </button>
        </div>
        <button className="bookmark-button">
          <FontAwesomeIcon icon={faBookmark} />
        </button>
      </div>
      
      <div className="recipe-content">
        <h3 className="recipe-title">{post.title || 'Delicious Recipe'}</h3>
        <p className="recipe-description">{post.recipe}</p>
        <div className="recipe-tags">
          {post.tags?.map((tag, index) => (
            <span key={index} className="tag">#{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

// BottomNavBar Component
const BottomNavBar = ({ onHome, onSearch, onCreate, onProfile }) => {
  return (
    <nav className="bottom-navbar">
      <button className="nav-item" onClick={onHome}>
        <FontAwesomeIcon icon={faHome} />
        <span>Home</span>
      </button>
      <button className="nav-item" onClick={onSearch}>
        <FontAwesomeIcon icon={faSearch} />
        <span>Search</span>
      </button>
      <button className="nav-item create-button" onClick={onCreate}>
        <FontAwesomeIcon icon={faPlus} />
        <span>Create</span>
      </button>
      <button className="nav-item" onClick={onProfile}>
        <FontAwesomeIcon icon={faUser} />
        <span>Profile</span>
      </button>
    </nav>
  );
};

// Main FYP Component
const Fyp = ({ user, goToProfile, goToHome, goToPlus, goToUserProfile }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [feed, setFeed] = useState([
    {
      id: 1,
      user: "Mario",
      location: "St. Utica, Pennsylvania",
      img: require('../../Images/1Girl.jpg'),
      likes: 0,
      likedBy: [],
      comments: 0,
      shares: 0,
      recipe: "This is Mario's special pasta recipe with fresh tomatoes and basil. Enjoy!",
      tags: ["italian", "pasta", "vegetarian"]
    },
    {
      id: 2,
      user: "Mariam",
      location: "Syracuse, Connecticut",
      img: require('../../Images/1Girl.jpg'),
      likes: 0,
      likedBy: [],
      comments: 0,
      shares: 0,
      recipe: "Mariam's delicious chocolate cake recipe goes here. Perfect for birthdays!",
      tags: ["dessert", "chocolate", "baking"]
    }
  ]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLike = (postId, e) => {
    e.stopPropagation();
    setFeed(prevFeed => {
      return prevFeed.map(post => {
        if (post.id === postId) {
          const alreadyLiked = post.likedBy.includes(user.username);
          return {
            ...post,
            likes: alreadyLiked ? post.likes - 1 : post.likes + 1,
            likedBy: alreadyLiked
              ? post.likedBy.filter(username => username !== user.username)
              : [...post.likedBy, user.username]
          };
        }
        return post;
      });
    });
  };

  const handleUserClick = (e, username) => {
    e.stopPropagation();
    if (username === user?.username) {
      goToProfile();
    } else {
      goToUserProfile(username);
    }
  };

  return (
    <div className="fyp-container">
      <div className="main-content">
        <Sidebar 
          onHome={goToHome}
          onSearch={() => {}}
          onCreate={goToPlus}
          onProfile={goToProfile}
        />
        
        <main className="feed">
          {feed.map(post => (
            <RecipePostCard
              key={post.id}
              post={post}
              user={user}
              onLike={handleLike}
              onComment={() => setSelectedPost(post)}
              onShare={() => {}}
              onUserClick={handleUserClick}
            />
          ))}
        </main>
        
        <aside className="suggestions">
          <h3>Suggested Users</h3>
          {/* Add suggested users component here */}
        </aside>
      </div>
      
      <BottomNavBar 
        onHome={goToHome}
        onSearch={() => {}}
        onCreate={goToPlus}
        onProfile={goToProfile}
      />
    </div>
  );
};

export default Fyp;