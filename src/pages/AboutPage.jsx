import React,{useEffect,useState} from 'react';
import Header from '../components/Header/Header';
import './about.css';  // Create a separate CSS file for styling (optional)

const AboutPage = () => {
  return (
    <div>
      <Header />
      <section className="about-section">
        <h1>About Jain Tiffin Shala</h1>

        <section className="about-story">
          <h2>Our Story</h2>
          <p>
            Jain Tiffin Shala was founded with a simple yet powerful mission—to provide healthy, delicious, and home-cooked Jain meals to individuals who follow the Jain dietary principles. Our founder, [Founder Name], recognized the challenge of finding authentic, nutritious Jain food that fits busy lifestyles. With a deep commitment to health and well-being, we began preparing meals with the freshest ingredients, maintaining the integrity of Jain food traditions.
          </p>
        </section>

        <section className="about-mission">
          <h2>Mission & Values</h2>
          <p>
            At Jain Tiffin Shala, we are committed to offering high-quality, nutritious meals that respect Jain dietary principles. Our mission is to make it easier for people to enjoy wholesome, balanced meals while staying true to their values. We believe in:
            <ul>
              <li><strong>Quality</strong>: We source only the freshest, highest-quality ingredients for every meal.</li>
              <li><strong>Authenticity</strong>: Our meals are prepared following traditional Jain recipes, ensuring each bite is a taste of home.</li>
              <li><strong>Convenience</strong>: We deliver meals right to your doorstep, saving you time without compromising on taste or health.</li>
            </ul>
          </p>
        </section>

        <section className="about-team">
          <h2>Meet Our Team</h2>
          <p>
            Our team is made up of passionate individuals dedicated to bringing you the best Jain meals. Each member shares a commitment to delivering top-notch customer service and the highest quality food.
          </p>
          <div className="team-members">
            <div className="team-member">
              <img src="team-member1.jpg" alt="Team Member 1" />
              <h3>[Name]</h3>
              <p>Founder & CEO</p>
              <p>[Short description of the founder's background and role]</p>
            </div>
            <div className="team-member">
              <img src="team-member2.jpg" alt="Team Member 2" />
              <h3>[Name]</h3>
              <p>Head Chef</p>
              <p>[Short description of the head chef's experience and responsibilities]</p>
            </div>
            {/* Add more team members as needed */}
          </div>
        </section>
      </section>
    </div>
  );
}

export default AboutPage;