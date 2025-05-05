import React, { useState } from "react";
import './Profile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faSearch, faUser, faBookmark, faUsers, faPen, faTrophy } from '@fortawesome/free-solid-svg-icons';
import img1 from '../../Images/1Girl.jpg';



// --- ProfileHeader ---
const ProfileHeader = ({ user, isCurrentUser, onEdit, onFollowToggle }) => (
  <div className="profile-header">
    <div className="profile-cover">
      <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&h=120" alt="cover" />
    </div>
    <div className="profile-avatar-wrapper">
      <img className="profile-avatar" src={user.avatar || img1} alt="avatar" />
    </div>
    <div className="profile-info">
      <h2>{user.displayName || user.Username} <span className="profile-handle">@{user.Username?.toLowerCase()}</span></h2>
      {user.bio && <p className="profile-bio">{user.bio}</p>}
      {user.location && <p className="profile-location">📍 {user.location}</p>}
      {user.foodTags && <div className="profile-tags">{user.foodTags.map((tag, i) => <span key={i} className="tag">{tag}</span>)}</div>}
    </div>
    <div className="profile-stats">
      <div><span className="profile-stat-number">{user.posts?.length || 0}</span><span className="profile-stat-label">Posts</span></div>
      <div><span className="profile-stat-number">{user.followers || 0}</span><span className="profile-stat-label">Followers</span></div>
      <div><span className="profile-stat-number">{user.following || 0}</span><span className="profile-stat-label">Following</span></div>
    </div>
    <div className="profile-actions">
      {isCurrentUser ? (
        <button className="profile-message" onClick={onEdit}><FontAwesomeIcon icon={faPen} /> Edit Profile</button>
      ) : (
        <button className="profile-follow" onClick={onFollowToggle}>{user.isFollowing ? 'Unfollow' : 'Follow'}</button>
      )}
    </div>
  </div>
);

// --- ProfileTabs ---
const TABS = [
  { key: 'posts', label: 'Posts', icon: faUser },
  { key: 'bookmarks', label: 'Bookmarks', icon: faBookmark },
  { key: 'followers', label: 'Followers', icon: faUsers },
  { key: 'following', label: 'Following', icon: faUsers },
  // { key: 'achievements', label: 'Achievements', icon: faTrophy },
];
const ProfileTabs = ({ activeTab, setActiveTab }) => (
  <div className="profile-tabs">
    {TABS.map(tab => (
      <button
        key={tab.key}
        className={`profile-tab${activeTab === tab.key ? ' active' : ''}`}
        onClick={() => setActiveTab(tab.key)}
      >
        <FontAwesomeIcon icon={tab.icon} /> {tab.label}
      </button>
    ))}
  </div>
);

// --- Placeholder Subcomponents ---
const PostGrid = ({ posts }) => (
  <div className="profile-gallery">
    {posts.length === 0 ? <NoContentPlaceholder message="You haven't shared any recipes yet!" /> : posts.map((post, idx) => (
      <div className="profile-gallery-item card" key={idx}>
        <img src={post.image || post.img} alt={`gallery-${idx}`} />
      </div>
    ))}
  </div>
);
const BookmarksGrid = ({ bookmarks }) => (
  <div className="profile-gallery">
    {bookmarks.length === 0 ? <NoContentPlaceholder message="No bookmarks yet!" /> : bookmarks.map((post, idx) => (
      <div className="profile-gallery-item card" key={idx}>
        <img src={post.image || post.img} alt={`bookmark-${idx}`} />
      </div>
    ))}
  </div>
);
const FollowersList = ({ followers }) => (
  <div className="profile-list">
    {followers.length === 0 ? <NoContentPlaceholder message="No followers yet!" /> : followers.map((user, idx) => (
      <div className="profile-list-item" key={idx}>{user.displayName || user.Username} @{user.Username}</div>
    ))}
  </div>
);
const FollowingList = ({ following }) => (
  <div className="profile-list">
    {following.length === 0 ? <NoContentPlaceholder message="Not following anyone yet!" /> : following.map((user, idx) => (
      <div className="profile-list-item" key={idx}>{user.displayName || user.Username} @{user.Username}</div>
    ))}
  </div>
);
const NoContentPlaceholder = ({ message }) => (
  <div className="no-content-placeholder">{message}</div>
);
const EditProfileModal = ({ show, onClose, user, onSave }) => show ? (
  <div className="edit-profile-modal">
    <div className="modal-content">
      <h2>Edit Profile</h2>
      {/* Add form fields here */}
      <button onClick={onClose}>Close</button>
    </div>
  </div>
) : null;

// --- Main Profilee Component ---
const Profilee = ({ user, goToProfile, goToHome, goToPlus, updateUser }) => {
  const [activeTab, setActiveTab] = useState('posts');
  const [editModalOpen, setEditModalOpen] = useState(false);
  if (!user) {
    return <div className="no-content-placeholder">You must be logged in to view this page.</div>;
  }
  const isCurrentUser = true; // Replace with auth logic if needed

  // Placeholder data for followers/following/bookmarks
  const bookmarks = user.bookmarks || [];
  const followers = user.followersList || [];
  const following = user.followingList || [];

  return (
    <div className="profile-container">
      <div className="profile-card">
        <ProfileHeader
          user={user}
          isCurrentUser={isCurrentUser}
          onEdit={() => setEditModalOpen(true)}
          onFollowToggle={() => {}}
        />
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === 'posts' && <PostGrid posts={user.posts || []} />}
        {activeTab === 'bookmarks' && <BookmarksGrid bookmarks={bookmarks} />}
        {activeTab === 'followers' && <FollowersList followers={followers} />}
        {activeTab === 'following' && <FollowingList following={following} />}
      </div>
      <EditProfileModal show={editModalOpen} onClose={() => setEditModalOpen(false)} user={user} onSave={updateUser} />
    </div>
  );
};

export default Profilee;
