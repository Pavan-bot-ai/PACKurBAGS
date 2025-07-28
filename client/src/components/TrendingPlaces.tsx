
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Users } from "lucide-react";
import { useEffect, useRef } from "react";

interface TrendingPlacesProps {
  onPlaceClick?: (destination: string) => void;
  onImageClick?: (destination: string) => void;
}

const trendingPlaces = [
  {
    id: 1,
    name: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop",
    rating: 4.9,
    reviews: 2847,
    price: "$1,200",
    highlights: ["Sunset Views", "Blue Domes", "Wine Tasting"]
  },
  {
    id: 2,
    name: "Kyoto, Japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop",
    rating: 4.8,
    reviews: 1923,
    price: "$1,800",
    highlights: ["Temples", "Cherry Blossoms", "Traditional Culture"]
  },
  {
    id: 3,
    name: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop",
    rating: 4.7,
    reviews: 3241,
    price: "$900",
    highlights: ["Rice Terraces", "Beaches", "Temples"]
  },
  {
    id: 4,
    name: "Iceland",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    rating: 4.9,
    reviews: 1567,
    price: "$2,200",
    highlights: ["Northern Lights", "Waterfalls", "Blue Lagoon"]
  },
  {
    id: 5,
    name: "Machu Picchu, Peru",
    image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400&h=300&fit=crop",
    rating: 4.8,
    reviews: 2156,
    price: "$1,500",
    highlights: ["Ancient Ruins", "Inca Trail", "Mountain Views"]
  }
];

const TrendingPlaces = ({ onPlaceClick, onImageClick }: TrendingPlacesProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const scrollSpeed = 1; // pixels per frame
    const cardWidth = 320; // approximate card width with gap
    const totalWidth = trendingPlaces.length * cardWidth;

    const scroll = () => {
      scrollPosition += scrollSpeed;
      
      // Reset position when we've scrolled through all cards
      if (scrollPosition >= totalWidth) {
        scrollPosition = 0;
      }
      
      scrollContainer.scrollLeft = scrollPosition;
    };

    const intervalId = setInterval(scroll, 50); // 20fps for smooth scrolling

    // Pause scrolling on hover
    const handleMouseEnter = () => clearInterval(intervalId);
    const handleMouseLeave = () => {
      const newIntervalId = setInterval(scroll, 50);
      return newIntervalId;
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', () => {
      const newIntervalId = setInterval(scroll, 50);
      scrollContainer.dataset.intervalId = newIntervalId.toString();
    });

    return () => {
      clearInterval(intervalId);
      scrollContainer?.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleCardClick = (place: any, event: React.MouseEvent) => {
    // Check if the click was on the image
    const target = event.target as Element;
    if (target.tagName === 'IMG') {
      onImageClick?.(place.name);
    } else {
      onPlaceClick?.(place.name);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Auto-scrolling horizontal container */}
      <div 
        ref={scrollRef}
        className="flex space-x-6 overflow-x-hidden pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Duplicate the places array to create seamless loop */}
        {[...trendingPlaces, ...trendingPlaces].map((place, index) => (
          <Card 
            key={`${place.id}-${index}`} 
            className="flex-none w-80 card-hover cursor-pointer"
            onClick={(e) => handleCardClick(place, e)}
          >
            <div className="relative">
              <img 
                src={place.image} 
                alt={place.name}
                className="w-full h-48 object-cover rounded-t-lg cursor-pointer hover:opacity-90 transition-opacity"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-black/20 backdrop-blur-sm text-white border-0">
                  {place.price}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <h4 className="font-bold text-lg mb-2">{place.name}</h4>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{place.rating}</span>
                  <span className="text-gray-500 text-sm">({place.reviews})</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{place.reviews}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {place.highlights.map((highlight, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {highlight}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TrendingPlaces;
