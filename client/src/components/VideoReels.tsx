
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Star, MapPin, Heart } from "lucide-react";
import { useState, useRef } from "react";
import VideoModal from "./VideoModal";
import { apiRequest } from "@/lib/queryClient";

const videoReels = [
  {
    id: 1,
    title: "Hidden Gems of Tokyo",
    location: "Tokyo, Japan",
    thumbnail: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300&h=400&fit=crop",
    videoUrl: "/attached_assets/tokyo_city.mp4",
    rating: 4.8,
    views: "2.3M",
    duration: "3:45",
    author: "TravelWithSarah"
  },
  {
    id: 2,
    title: "Bali Beach Sunset",
    location: "Bali, Indonesia",
    thumbnail: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=300&h=400&fit=crop",
    videoUrl: "/attached_assets/bali beach sunset_1752216724766.mp4",
    rating: 4.9,
    views: "1.8M",
    duration: "2:30",
    author: "IslandVibes"
  },
  {
    id: 3,
    title: "Swiss Mountain Adventure",
    location: "Swiss Alps",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop",
    videoUrl: "/attached_assets/swiss_alps_adventure.mp4",
    rating: 4.7,
    views: "950K",
    duration: "4:12",
    author: "MountainExplorer"
  },
  {
    id: 4,
    title: "Santorini Blue Domes",
    location: "Santorini, Greece",
    thumbnail: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=300&h=400&fit=crop",
    videoUrl: "/attached_assets/santorini_blue_domes.mp4",
    rating: 4.9,
    views: "3.1M",
    duration: "2:15",
    author: "GreekIslands"
  },
  {
    id: 5,
    title: "Dubai Skyline at Night",
    location: "Dubai, UAE",
    thumbnail: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=300&h=400&fit=crop",
    videoUrl: "/attached_assets/dubai_skyline_night.mp4",
    rating: 4.6,
    views: "1.2M",
    duration: "3:20",
    author: "CityLights"
  },
  {
    id: 6,
    title: "Machu Picchu Sunrise",
    location: "Machu Picchu, Peru",
    thumbnail: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=300&h=400&fit=crop",
    videoUrl: "/attached_assets/machu_picchu_sunrise.mp4",
    rating: 4.8,
    views: "890K",
    duration: "5:00",
    author: "AndeanAdventure"
  }
];

const VideoReels = () => {
  const [savedPlaces, setSavedPlaces] = useState<Set<number>>(new Set());
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  const handleHeartClick = async (reel: any) => {
    const userId = 1; // Mock user ID - replace with actual auth
    const isCurrentlySaved = savedPlaces.has(reel.id);

    if (isCurrentlySaved) {
      // Remove from saved places
      try {
        await apiRequest('DELETE', '/api/saved-places', { userId, placeId: reel.id.toString() });
        setSavedPlaces(prev => {
          const newSet = new Set(prev);
          newSet.delete(reel.id);
          return newSet;
        });
      } catch (error) {
        console.error('Error removing saved place:', error);
      }
    } else {
      // Add to saved places
      try {
        await apiRequest('POST', '/api/saved-places', {
          userId,
          placeId: reel.id.toString(),
          title: reel.title,
          location: reel.location,
          thumbnail: reel.thumbnail
        });
        setSavedPlaces(prev => new Set(prev).add(reel.id));
      } catch (error) {
        console.error('Error saving place:', error);
      }
    }
  };

  const handleVideoHover = (reelId: number, isHovering: boolean) => {
    const video = videoRefs.current[reelId];
    if (!video) return;

    if (isHovering) {
      setHoveredVideo(reelId);
      video.currentTime = 0;
      video.play().catch(() => {
        // Fallback to showing thumbnail if video fails
        console.log('Video playback failed for', reelId);
      });
    } else {
      setHoveredVideo(null);
      video.pause();
      video.currentTime = 0;
    }
  };

  const handleVideoClick = (reelId: number) => {
    setSelectedVideo(reelId);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  const selectedReel = selectedVideo ? videoReels.find(reel => reel.id === selectedVideo) : null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videoReels.map((reel) => (
          <Card 
            key={reel.id} 
            className="group cursor-pointer card-hover overflow-hidden"
            onMouseEnter={() => handleVideoHover(reel.id, true)}
            onMouseLeave={() => handleVideoHover(reel.id, false)}
            onClick={() => handleVideoClick(reel.id)}
          >
            <CardContent className="p-0">
              <div className="relative">
              {/* Video element */}
              <video
                ref={(el) => videoRefs.current[reel.id] = el}
                src={reel.videoUrl}
                className={`w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500 ${
                  hoveredVideo === reel.id ? 'opacity-100' : 'opacity-0'
                }`}
                muted
                loop
                playsInline
                style={{ 
                  position: hoveredVideo === reel.id ? 'relative' : 'absolute',
                  top: hoveredVideo === reel.id ? 'auto' : 0,
                  left: hoveredVideo === reel.id ? 'auto' : 0,
                  zIndex: hoveredVideo === reel.id ? 10 : 1
                }}
              />

              {/* Thumbnail image */}
              <img 
                src={reel.thumbnail} 
                alt={reel.title}
                className={`w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500 ${
                  hoveredVideo === reel.id ? 'opacity-0' : 'opacity-100'
                }`}
                style={{ 
                  position: hoveredVideo === reel.id ? 'absolute' : 'relative',
                  top: hoveredVideo === reel.id ? 0 : 'auto',
                  left: hoveredVideo === reel.id ? 0 : 'auto',
                  zIndex: hoveredVideo === reel.id ? 1 : 10
                }}
              />
              
              {/* Play Button Overlay - only show when not hovering */}
              <div className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-300 ${
                hoveredVideo === reel.id ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
              }`}
              style={{ zIndex: 20 }}
              >
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Play className="w-8 h-8 text-white ml-1" fill="white" />
                </div>
              </div>

              {/* Duration Badge */}
              <div className="absolute top-4 right-4" style={{ zIndex: 30 }}>
                <Badge className="bg-black/70 text-white hover:bg-black/70">
                  {reel.duration}
                </Badge>
              </div>

              {/* Heart Icon */}
              <div className="absolute top-4 left-4" style={{ zIndex: 30 }}>
                <Heart 
                  className={`w-6 h-6 transition-colors cursor-pointer ${
                    savedPlaces.has(reel.id)
                      ? 'text-red-500 fill-red-500'
                      : 'text-white/80 hover:text-red-400 hover:fill-red-400'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleHeartClick(reel);
                  }}
                />
              </div>

              {/* Views Badge */}
              <div className="absolute bottom-4 right-4" style={{ zIndex: 30 }}>
                <Badge variant="secondary" className="bg-white/90">
                  {reel.views} views
                </Badge>
              </div>
              </div>

              <div className="p-4">
              <h4 className="font-semibold text-lg mb-2 line-clamp-2">{reel.title}</h4>
              
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600 text-sm">{reel.location}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{reel.rating}</span>
                </div>
                <span className="text-sm text-gray-500">@{reel.author}</span>
              </div>
              </div>
            </CardContent>
          </Card>
      ))}
    </div>

    {/* Video Modal */}
    {selectedReel && (
      <VideoModal
        isOpen={selectedVideo !== null}
        videoUrl={selectedReel.videoUrl}
        title={selectedReel.title}
        location={selectedReel.location}
        author={selectedReel.author}
        onClose={closeVideoModal}
        onHeartClick={() => handleHeartClick(selectedReel)}
        isLiked={savedPlaces.has(selectedReel.id)}
      />
    )}
    </>
  );
};

export default VideoReels;
