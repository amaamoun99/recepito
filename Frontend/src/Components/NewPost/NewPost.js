import React, { useState } from "react";
import './NewPost.css';

const NewPost = ({ onAdd, onCancel, user }) => {
  const [image, setImage] = useState(null);
  const [recipe, setRecipe] = useState("");

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (image && recipe) {
      onAdd({ img: image, recipe, user: user.Username, location: "Your Location", likes: 0, comments: 0, shares: 0 });
    }
  };

  return (
    <div className="newpost-bg">
      <form className="newpost-card" onSubmit={handleSubmit}>
        <h2 className="newpost-title">Add New Recipe</h2>
        <label className="newpost-label">Photo</label>
        <label className="newpost-file-btn">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="newpost-input"
            style={{ display: "none" }}
          />
          {image ? "Change Photo" : "Choose Photo"}
        </label>
        {image && <img src={image} alt="preview" className="newpost-preview" />}
        <label className="newpost-label">Recipe</label>
        <textarea
          className="newpost-textarea"
          value={recipe}
          onChange={e => setRecipe(e.target.value)}
          placeholder="Write your recipe here..."
          required
        />
        <div className="newpost-actions">
          <button type="button" className="newpost-cancel" onClick={onCancel}>Cancel</button>
          <button type="submit" className="newpost-submit">Done</button>
        </div>
      </form>
    </div>
  );
};

export default NewPost;
