import React from 'react';
import './fs.css'

const FeaturedServices = () => {
  return (
    <section className="featured-services">
      <h2>Our Offerings</h2>
      <div className="service-list">
        <div className="service-item">
          <h3>Healthy Jain Meals</h3>
          <p>We provide balanced, wholesome meals that strictly follow Jain dietary principles.</p>
        </div>
        <div className="service-item">
          <h3>Fresh Ingredients</h3>
          <p>All meals are prepared daily with the freshest ingredients, ensuring taste and nutrition.</p>
        </div>
        <div className="service-item">
          <h3>Flexible Menu</h3>
          <p>Choose from a variety of dishes for breakfast, lunch, and dinner, catering to your preferences.</p>
        </div>
      </div>
    </section>
  );
}

export default FeaturedServices;
