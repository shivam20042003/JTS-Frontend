import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css'; 
import 'swiper/css/pagination';
import './hero.css';

const HeroSection = () => {
  const swiperRef = useRef(null);  // Create a reference for the Swiper

  const images = [
    "src/assets/show10.jpeg",
    "src/assets/show2.jpeg",
    "src/assets/show3.jpeg",
    "src/assets/show4.jpeg",
    "src/assets/show5.jpeg",
    "src/assets/show6.jpeg",
    "src/assets/show7.jpeg",
    "src/assets/show8.jpeg",
    "src/assets/show9.jpeg",
  ];

  return (
    <div className="hero-section">
      {/* Swiper component with the ref */}
      <Swiper
      modules={[Pagination,Autoplay]}
        onInit={(swiper) => {
          swiperRef.current = swiper; // Save swiper instance to the ref
        }}
        autoplay = {{delay : 2500}}
        scrollbar={{ draggable: true }}
        loop={true}
        pagination={{ clickable: true }}
        className="hero-swiper"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img src={image} alt={`Slide ${index + 1}`} className="hero-image" />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation buttons */}
      <div className="swiper-navigation">
        <button
          className="swiper-button-prev"
          onClick={() => swiperRef.current?.slidePrev()}  // Navigate to the previous slide
        >
          &#10094; {/* Left Arrow */}
        </button>
        <button
          className="swiper-button-next"
          onClick={() => swiperRef.current?.slideNext()}  // Navigate to the next slide
        >
          &#10095; {/* Right Arrow */}
        </button>
      </div>

      <div className="hero-content">
        <h1 className="hero-title">Delicious Jain Meals Delivered Fresh to Your Doorstep</h1>
        <div className="cta-buttons">
          <Link to="/menu" className="cta-button">View Menu</Link>
          <Link to="/order" className="cta-button">Order Now</Link>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;