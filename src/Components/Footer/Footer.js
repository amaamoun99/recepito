import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faHome, faUser } from '@fortawesome/free-solid-svg-icons';
import './Footer.css'; // Create this for footer-specific styles

const Footer = ({ onHome, onPlus, onProfile }) => (
  <div className="fyp-bottom-nav">
    <FontAwesomeIcon icon={faHome} onClick={onHome} style={{ cursor: "pointer" }} />
    <div className="fyp-bottom-plus" onClick={onPlus} style={{ cursor: "pointer" }}>
      <FontAwesomeIcon icon={faPlus} />
    </div>
    <FontAwesomeIcon icon={faUser} onClick={onProfile} style={{ cursor: "pointer" }} />
  </div>
);

export default Footer;