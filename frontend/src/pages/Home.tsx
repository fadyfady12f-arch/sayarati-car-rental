import HeroSection from '../components/landing/HeroSection';
import SearchForm from '../components/landing/SearchForm';
import Categories from '../components/landing/Categories';
import FeaturedCars from '../components/landing/FeaturedCars';
import HowItWorks from '../components/landing/HowItWorks';
import Features from '../components/landing/Features';
import Testimonials from '../components/landing/Testimonials';
import Branches from '../components/landing/Branches';
import Newsletter from '../components/landing/Newsletter';

const Home = () => {
  return (
    <div>
      <HeroSection />
      <SearchForm />
      <Categories />
      <FeaturedCars />
      <HowItWorks />
      <Features />
      <Testimonials />
      <Branches />
      <Newsletter />
    </div>
  );
};

export default Home;
