import React,{useEffect,useState} from 'react';
import Header from '../components/Header/Header';
import HeroSection from '../components/HeroSection/HeroSection';
import FeaturedServices from '../components/FS/FeaturedServices';
import Testimonials from '../components/Testimonials/Testimonials';
import Footer from '../components/footer/Footer';


const HomePage = () => {
  const [shift,setShift] = useState(false);
  useEffect(()=>{setShift(!shift);},[]);
  return (
    <div>
      <Header value = {shift} />
      <HeroSection />
      <FeaturedServices />
      <Testimonials />
      <Footer />
    </div>
  );
}

export default HomePage;
