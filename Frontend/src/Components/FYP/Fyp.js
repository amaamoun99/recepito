import React, { useState } from "react";
import './Fyp.css';
import Footer from '../Footer/Footer';
import RecipeDetail from '../CardReciepe/RecipeDetail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faShare, faUser, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

const Fyp = ({ user, goToProfile, goToHome, goToPlus, goToUserProfile }) => {
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [likedByModal, setLikedByModal] = useState(null);

  // Sample feed data with like functionality
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
      recipe: "This is Mario's special pasta recipe with fresh tomatoes and basil. Enjoy!"
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
      recipe: "Mariam's delicious chocolate cake recipe goes here. Perfect for birthdays!"
    },
    {
      id: 3,
      user: "Alex Morgan",
      location: "Boston, Massachusetts",
      img: require('../../Images/1Girl.jpg'),
      likes: 0,
      likedBy: [],
      comments: 0,
      shares: 0,
      recipe: "Healthy quinoa salad with avocado and lemon dressing."
    }
  ]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setIsSearching(query.length > 0);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
  };

  const filteredPosts = feed.filter(post => 
    post.recipe.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserClick = (e, username) => {
    e.stopPropagation();
    if (username === user?.username) {
      goToProfile();
    } else {
      goToUserProfile(username);
    }
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

  const showLikedBy = (post, e) => {
    e.stopPropagation();
    setLikedByModal(post);
  };

  const closeLikedByModal = () => {
    setLikedByModal(null);
  };

  return (
    <div id="root">
      <div className="fyp-bg">
        {/* Top Bar with Search */}
        <div className="fyp-topbar">
          <div className="fyp-search-container">
            <FontAwesomeIcon icon={faSearch} className="fyp-search-icon" />
            <input 
              className="fyp-search" 
              placeholder="Search recipes..." 
              value={searchQuery}
              onChange={handleSearch}
            />
            {searchQuery && (
              <FontAwesomeIcon 
                icon={faTimes} 
                className="fyp-clear-icon"
                onClick={clearSearch}
              />
            )}
          </div>
          <FontAwesomeIcon 
            icon={faUser} 
            className="fyp-user-icon" 
            onClick={() => goToProfile()} 
            style={{ cursor: "pointer" }}
          />
        </div>

        {/* Feed */}
        <div className="fyp-feed">
          {isSearching ? (
            <div className="search-results-container">
              <h3 className="search-results-title">Search Results for "{searchQuery}"</h3>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post, idx) => (
                  <div
                    className="fyp-card search-result-card"
                    key={`search-${idx}`}
                    onClick={() => setSelected(post)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="search-result-content">
                      <img src={post.img} alt={post.user} className="search-result-avatar" />
                      <div className="search-result-text">
                        <div className="search-result-user">{post.user}</div>
                        <div className="search-result-recipe">
                          {post.recipe.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, i) => (
                            part.toLowerCase() === searchQuery.toLowerCase() ? (
                              <span key={i} className="highlight">{part}</span>
                            ) : (
                              <span key={i}>{part}</span>
                            )
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">No recipes found matching "{searchQuery}"</div>
              )}
            </div>
          ) : (
            feed.map((post, idx) => (
              <div
                className="fyp-card"
                key={idx}
                onClick={() => setSelected(post)}
                style={{ cursor: "pointer" }}
              >
                <div
                  className="fyp-card-header"
                  onClick={(e) => handleUserClick(e, post.user)}
                  style={{ cursor: "pointer" }}
                >
                  <img src={post.img} alt={post.user} className="fyp-card-avatar" />
                  <div>
                    <div className="fyp-card-user">{post.user}</div>
                    <div className="fyp-card-location">{post.location}</div>
                  </div>
                  <div className="fyp-card-menu">⋮</div>
                </div>

                <img src={post.img} alt="post" className="fyp-card-img" />
                <div className="fyp-card-actions">
                  <div 
                    onClick={(e) => post.likes > 0 ? showLikedBy(post, e) : handleLike(post.id, e)}
                    className={post.likedBy.includes(user?.username) ? "liked" : ""}
                  >
                    <FontAwesomeIcon 
                      icon={faHeart} 
                      className={post.likedBy.includes(user?.username) ? "liked-icon" : ""} 
                    />
                    <span>{post.likes}</span>
                  </div>
                  <div><FontAwesomeIcon icon={faComment} /> <span>{post.comments}</span></div>
                  <div><FontAwesomeIcon icon={faShare} /> <span>{post.shares}</span></div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Recipe Detail Modal */}
        {selected && (
          <RecipeDetail
            image={selected.img}
            username={selected.user}
            recipe={selected.recipe}
            onClose={() => setSelected(null)}
          />
        )}

        {/* Liked By Modal */}
        {likedByModal && (
          <div className="liked-by-modal">
            <div className="liked-by-content">
              <div className="liked-by-header">
                <h3>Liked by</h3>
                <button onClick={closeLikedByModal} className="close-modal">×</button>
              </div>
              <div className="liked-by-list">
                {likedByModal.likedBy.length > 0 ? (
                  likedByModal.likedBy.map((username, index) => (
                    <div key={index} className="liked-by-user">
                      <FontAwesomeIcon icon={faUser} className="user-icon" />
                      <span>{username}</span>
                    </div>
                  ))
                ) : (
                  <div className="no-likes">No likes yet</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <Footer 
          onHome={goToHome} 
          onPlus={goToPlus} 
          onProfile={() => goToProfile()} 
        />
      </div>
    </div>
  );
};

export default Fyp;