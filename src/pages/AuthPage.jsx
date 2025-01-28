import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './auth.css';

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password:'',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp) {

      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          alert("Registration successful!");
          setIsSignUp(false); // Switch to login after successful registration
        } else {
          alert("Error during registration!");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong!");
      }
    } else {
      // Handle sign in logic
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: formData.phone,
            password: formData.password,
          }),
        });
  
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("userEmail", data.user.email);
          localStorage.setItem("userID", data.user.id);
          localStorage.setItem("userName", data.user.name);
          localStorage.setItem("userPhone", data.user.phone);
          localStorage.setItem("authToken", data.token);
          alert("Login successful!");
          navigate("/");
        } else {
          const error = await response.json();
          alert(error.error);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong!");
      } 
    }
  };

  const handleCancel = () => {
    navigate('/'); // Redirect to home page
  };

  return (
    <div className="auth-container">
      <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        {isSignUp && (
          <>
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}
        <div>
          <label>Phone:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="button-group">
          <button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
          <button type="button" onClick={handleCancel} className="cancel-button">
            Cancel
          </button>
        </div>
      </form>
      <p onClick={() => setIsSignUp(!isSignUp)} className="toggle-link">
        {isSignUp
          ? 'Already have an account? Sign In'
          : 'Don’t have an account? Sign Up'}
      </p>
    </div>
  );
};

export default AuthPage;