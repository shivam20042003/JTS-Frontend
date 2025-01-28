import React, { useState,useEffect } from 'react';
import Header from '../components/Header/Header';

import './contact.css';

const ContactPage = () => {
  const [contactDetails, setContactDetails] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactDetails({ ...contactDetails, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent: " + JSON.stringify(contactDetails));
    // Typically, you would send the message to your backend here.
  };

  return (
    <div>
      
      <div className="contact-container">
  <h1>Contact Us</h1>
  <form onSubmit={handleSubmit} className="contact-form">
    <div className="form-group">
      <label>Name:</label>
      <input
        type="text"
        name="name"
        value={contactDetails.name}
        onChange={handleChange}
        required
      />
    </div>
    <div className="form-group">
      <label>Email:</label>
      <input
        type="email"
        name="email"
        value={contactDetails.email}
        onChange={handleChange}
        required
      />
    </div>
    <div className="form-group">
      <label>Phone:</label>
      <input
        type="tel"
        name="phone"
        value={contactDetails.phone}
        onChange={handleChange}
        required
      />
    </div>
    <div className="form-group">
      <label>Message:</label>
      <textarea
        name="message"
        value={contactDetails.message}
        onChange={handleChange}
        required
      ></textarea>
    </div>
    <button type="submit" className="submit-button">
      Send Message
    </button>
  </form>

  <h2>Our Location</h2>
  <div className="map-container">
    <iframe
      title="Location Map"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.477155812171!2d77.3702526150844!3d28.557509682482672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd91d2b7db0b%3A0xf138b7330d5e1c83!2sJain%20Tiffin%20Shala!5e0!3m2!1sen!2sin!4v1631631156103!5m2!1sen!2sin"
      allowFullScreen=""
      loading="lazy"
    ></iframe>
  </div>
</div>
      
    </div>
  );
};

export default ContactPage;