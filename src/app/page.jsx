'use client'
import NavBar from '../components/NavBar';
import BannerCarousel from '../components/BannerCarousel';
import BestsellerSection from '../components/BestsellerSection';
import FooterSection from '../components/FooterSection';
import FurnitureCategorySection from '../components/FurnitureCategorySection';
import SingleBanner from '../components/SingleBanner';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />      
      <BannerCarousel />

      {/* Section with shared background image */}
      <div
        className="relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/background/BG5.png')` }}
      >
        <div className="relative z-10">
          <BestsellerSection />
          <FurnitureCategorySection />
          <SingleBanner />
        </div>
      </div>

      <FooterSection bgName="BG1" />
    </div>
  );
}
