
import TrendingPlaces from "@/components/TrendingPlaces";

interface HeroSectionProps {
  onPlaceClick: (destination: string) => void;
  onImageClick: (destination: string) => void;
}

const HeroSection = ({ onPlaceClick, onImageClick }: HeroSectionProps) => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Discover Your Next Adventure
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Let AI plan your perfect trip with personalized recommendations and smart itineraries
          </p>
        </div>
        <TrendingPlaces 
          onPlaceClick={onPlaceClick} 
          onImageClick={onImageClick}
        />
      </div>
    </section>
  );
};

export default HeroSection;
