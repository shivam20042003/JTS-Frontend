import React from 'react';
import './testimonials.css'

const Testimonials = () => {
  return (
    <section className="testimonials">
      <h2>What Our Customers Say</h2>
      <div className="testimonial-item">
        <p>"The food is absolutely delicious and reminds me of home-cooked meals!"</p>
        <p>- Priya S.</p>
      </div>
      <div className="testimonial-item">
        <p>"I love the variety in the menu and how fresh everything tastes!"</p>
        <p>- Rohit M.</p>
      </div>
      <div className="testimonial-item">
        <p>"Jain Tiffin Shala has made my life so much easier with their meal delivery!"</p>
        <p>- Sneha K.</p>
      </div>
    </section>
  );
}

export default Testimonials;
