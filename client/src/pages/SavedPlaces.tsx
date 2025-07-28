import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Trash2, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

interface SavedPlace {
  id: number;
  placeId: string;
  title: string;
  location: string;
  thumbnail: string;
  createdAt: string;
}

const SavedPlaces = () => {
  const [, setLocation] = useLocation();
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedPlaces();
  }, []);

  const fetchSavedPlaces = async () => {
    try {
      const userId = 1; // Mock user ID - replace with actual auth
      const places = await apiRequest('GET', `/api/saved-places?userId=${userId}`);
      setSavedPlaces(places);
    } catch (error) {
      console.error('Error fetching saved places:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeSavedPlace = async (placeId: string) => {
    try {
      const userId = 1; // Mock user ID - replace with actual auth
      await apiRequest('DELETE', '/api/saved-places', { userId, placeId });
      setSavedPlaces(prev => prev.filter(place => place.placeId !== placeId));
    } catch (error) {
      console.error('Error removing saved place:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/")}
              className="mr-3"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Saved Places</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/")}
              className="mr-3"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Saved Places</h1>
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            {savedPlaces.length} {savedPlaces.length === 1 ? 'place' : 'places'} saved
          </Badge>
        </div>

        {/* Content */}
        {savedPlaces.length === 0 ? (
          <Card className="p-12 text-center">
            <CardContent>
              <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">No saved places yet</h2>
              <p className="text-gray-500 mb-6">
                Start exploring and save your favorite destinations by clicking the heart icon
              </p>
              <Button onClick={() => setLocation("/")} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                Discover Places
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedPlaces.map((place) => (
              <Card key={place.id} className="group cursor-pointer hover:shadow-lg transition-shadow overflow-hidden">
                <div className="relative">
                  <img 
                    src={place.thumbnail} 
                    alt={place.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Remove button */}
                  <div className="absolute top-4 right-4">
                    <Button
                      size="sm"
                      variant="destructive"
                      className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSavedPlace(place.placeId);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Heart indicator */}
                  <div className="absolute top-4 left-4">
                    <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{place.title}</h3>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 text-sm">{place.location}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      Saved {new Date(place.createdAt).toLocaleDateString()}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setLocation("/")}
                    >
                      Explore
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPlaces;