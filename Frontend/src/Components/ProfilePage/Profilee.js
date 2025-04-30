import React, { useState } from "react";
import './Profile.css';
import Footer from '../Footer/Footer';
import RecipeDetail from '../CardReciepe/RecipeDetail';
import img1 from '../../Images/1Girl.jpg';
import img2 from '../../Images/2Girl.jpg';
import img3 from '../../Images/1Girl.jpg';
import img4 from '../../Images/1Girl.jpg';
import img5 from '../../Images/1Girl.jpg';
import img6 from '../../Images/1Girl.jpg';

// FontAwesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faShare, faHeart } from '@fortawesome/free-solid-svg-icons';

const imageOptions = [img1, img2, img3, img4, img5, img6];

const Profilee = ({ user, goToProfile, goToHome, goToPlus, updateUser }) => {
  const [selected, setSelected] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState(user.Username);
  const [password, setPassword] = useState(user.Password);
  const [avatar, setAvatar] = useState(user.avatar || img1);

  const posts = user.posts || [];

  const handleEdit = () => setEditMode(true);

  const handleDone = () => {
    // Update user info
    const updatedUser = {
      ...user,
      Username: username,
      Password: password,
      avatar: avatar
    };
    updateUser(updatedUser);
    setEditMode(false);
  };

  return (
    <div className="profile-bg">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-cover">
            <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&h=120" alt="cover" />
          </div>
          <div className="profile-avatar-wrapper">
            <img className="profile-avatar" src={avatar} alt="avatar" />
          </div>
          <div className="profile-stats">
            <div>
              <span className="profile-stat-number">32K</span>
              <span className="profile-stat-label">Followers</span>
            </div>
            <div>
              <span className="profile-stat-number">320</span>
              <span className="profile-stat-label">Following</span>
            </div>
          </div>
          <div className="profile-info">
            {editMode ? (
              <>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Username"
                />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password"
                />
                <div className="avatar-label">Choose your avatar</div>
                <div className="avatar-options">
                  {imageOptions.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`avatar-option-${idx}`}
                      className={`avatar-option${avatar === img ? " selected" : ""}`}
                      onClick={() => setAvatar(img)}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        objectFit: "cover",
                        margin: 4
                      }}
                    />
                  ))}
                </div>
                <button className="profile-done" onClick={handleDone}>Done</button>
              </>
            ) : (
              <h2>{username}</h2>
            )}
          </div>
          <div className="profile-actions">
            <button className="profile-follow">Recipes</button>
            <button className="profile-message" onClick={handleEdit}>Edit Profile</button>
          </div>
        </div>
        <div className="profile-gallery">
          {posts.map((post, idx) => (
            <div
              className="profile-gallery-item card"
              key={idx}
              onClick={() =>
                setSelected({
                  img: post.image || post.img,
                  user: username,
                  recipe: post.recipe
                })
              }
              style={{ cursor: "pointer" }}
            >
              <img src={post.image || post.img} alt={`gallery-${idx}`} />
              <div className="gallery-actions">
                <FontAwesomeIcon icon={faHeart} className="gallery-icon fa-heart" title="Like" />
                <FontAwesomeIcon icon={faComment} className="gallery-icon" title="Comment" />
                <FontAwesomeIcon icon={faShare} className="gallery-icon" title="Share" />
              </div>
            </div>
          ))}
        </div>
      </div>
      {selected && (
        <RecipeDetail
          image={selected.img}
          username={selected.user}
          recipe={selected.recipe}
          onClose={() => setSelected(null)}
        />
      )}
      <Footer onHome={goToHome} onPlus={goToPlus} onProfile={goToProfile} />
    </div>
  );
};

export default Profilee;
