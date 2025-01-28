import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './header.css';
import { BsList } from 'react-icons/bs';

const Header = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState('public/assets/LOGO.jpeg');

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      const fetchUserName = async () => {
        const email = localStorage.getItem("userEmail");
        if (!email) return;

        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/user/profile?email=${email}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }
          const data = await response.json();
          if (data.Profile_Photo) {
            const userProfff = `data:image/jpeg;base64,${data.Profile_Photo}`;
            setUserProfile(userProfff);
          }
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Error fetching user data:", error);
          alert("Failed to load user data.");
        }
      };

      fetchUserName();
    } else {
      setIsLoggedIn(false);
    }
  }, [props.shift]);

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src="public/assets/LOGO.jpeg" alt="Logo" className="logo-img" />
        </Link>
      </div>
      <nav>
        <ul>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/menu">Menu</Link></li>
          <li><Link to="/order">Cart</Link></li>
          <li>
            {isLoggedIn ? (
              <div className="profile-section">
                <Link to="/profile">
                  <img
                    src={userProfile}
                    alt="User Profile"
                    className="profile-picture"
                  />
                </Link>
              </div>
            ) : (
              <Link to="/signin">Sign In</Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;