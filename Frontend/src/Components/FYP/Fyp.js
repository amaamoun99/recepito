import React, { useState } from "react";
import './Fyp.css';
import Footer from '../Footer/Footer';
import RecipeDetail from '../CardReciepe/RecipeDetail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faShare, faPlus, faHome, faUser, faSearch } from '@fortawesome/free-solid-svg-icons';

const feed = [
  {
    user: "Dianne Russell",
    location: "St. Utica, Pennsylvania",
    img: require('../../Images/1Girl.jpg'),
    likes: 144,
    comments: 83,
    shares: 6,
    recipe: "This is Dianne's special recipe. Enjoy!"
  },
  {
    user: "Jenny Wilson",
    location: "Syracuse, Connecticut",
    img: require('../../Images/1Girl.jpg'),
    likes: 120,
    comments: 45,
    shares: 12,
    recipe: "Jenny's delicious recipe goes here."
  },
];

const Fyp = ({ user, goToProfile, goToHome, goToPlus }) => {
  const [selected, setSelected] = useState(null);
  const posts = user.posts || [];

  return (
    <div id="root">
      <div className="fyp-bg">
        {/* Top Bar */}
        <div className="fyp-topbar">
          <FontAwesomeIcon icon={faSearch} className="fyp-search-icon" />
          <input className="fyp-search" placeholder="Search" />
          <FontAwesomeIcon icon={faUser} className="fyp-user-icon" />
        </div>

        {/* Feed */}
        <div className="fyp-feed">
          {feed.map((post, idx) => (
            <div
              className="fyp-card"
              key={idx}
              onClick={() => setSelected(post)}
              style={{ cursor: "pointer" }}
            >
              <div className="fyp-card-header">
                <img src={post.img} alt={post.user} className="fyp-card-avatar" />
                <div>
                  <div className="fyp-card-user">{post.user}</div>
                  <div className="fyp-card-location">{post.location}</div>
                </div>
                <div className="fyp-card-menu">⋮</div>
              </div>
              <img src={post.img} alt="post" className="fyp-card-img" />
              <div className="fyp-card-actions">
                <div><FontAwesomeIcon icon={faHeart} /> <span>{post.likes}</span></div>
                <div><FontAwesomeIcon icon={faComment} /> <span>{post.comments}</span></div>
                <div><FontAwesomeIcon icon={faShare} /> <span>{post.shares}</span></div>
              </div>
            </div>
          ))}
        </div>

        {/* Show RecipeDetail modal if a post is selected */}
        {selected && (
          <RecipeDetail
            image={selected.img}
            username={selected.user}
            recipe={selected.recipe}
            onClose={() => setSelected(null)}
          />
        )}

        {/* Bottom Navigation */}
        <Footer onHome={goToHome} onPlus={goToPlus} onProfile={goToProfile} />
      </div>
    </div>
  );
};

export default Fyp;