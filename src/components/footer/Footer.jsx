import React from 'react';
import './footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook, faYoutube, faTwitter } from '@fortawesome/free-brands-svg-icons';


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>Contact Us: +91-1234567890</p>
        <p>Email: contact@jaintiffinshala.com</p>
        <div className="social-icons">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
        <FontAwesomeIcon icon={faInstagram} size="2x" />
      </a>
      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
        <FontAwesomeIcon icon={faFacebook} size="2x" />
      </a>
      <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
        <FontAwesomeIcon icon={faYoutube} size="2x" />
      </a>
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
        <FontAwesomeIcon icon={faTwitter} size="2x" />
      </a>
    </div>
        <p>&copy; 2024 Jain Tiffin Shala. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;