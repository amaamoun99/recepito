import React from "react";
import './RecipeDetail.css';

const RecipeDetail = ({ image, username, recipe, onClose }) => (
  <div className="recipe-detail-bg">
    <div className="recipe-detail-card">
      <div className="recipe-detail-left">
        <img src={image} alt="Recipe" className="recipe-detail-img" />
      </div>
      <div className="recipe-detail-right">
        <div className="recipe-detail-username">{username}</div>
        <div className="recipe-detail-recipe">{recipe}</div>
        <button className="recipe-detail-close" onClick={onClose}>Close</button>
      </div>
    </div>
  </div>
);

export default RecipeDetail;
