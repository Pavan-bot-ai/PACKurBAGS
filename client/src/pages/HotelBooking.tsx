import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Users, Bed, Calendar, DollarSign, ArrowLeft, AlertTriangle } from "lucide-react";
import { useLocation } from "wouter";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  price: number;
  image: string;
  amenities: string[];
  description: string;
  rooms: {
    type: string;
    price: number;
    image: string;
    description: string;
  }[];
}

const HotelBooking = () => {
  const [, setLocation] = useLocation();
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [groupMembers] = useState(4); // From previous booking flow
  const [numberOfRooms, setNumberOfRooms] = useState(1);
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [budgetLimit] = useState(50000); // $500 in cents
  const [budgetExceeded, setBudgetExceeded] = useState(false);

  // Mock hotel data for different destinations
  const hotels: Hotel[] = [
    {
      id: "1",
      name: "Tokyo Grand Hotel",
      location: "Shibuya, Tokyo",
      rating: 4.8,
      price: 15000, // $150 per night in cents
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop",
      amenities: ["Free WiFi", "Pool", "Gym", "Restaurant", "Room Service"],
      description: "Luxury hotel in the heart of Tokyo with modern amenities",
      rooms: [
        {
          type: "Standard Room",
          price: 15000,
          image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300&h=200&fit=crop",
          description: "Comfortable room with city view"
        },
        {
          type: "Deluxe Room",
          price: 22000,
          image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=300&h=200&fit=crop",
          description: "Spacious room with premium amenities"
        },
        {
          type: "Suite",
          price: 35000,
          image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=300&h=200&fit=crop",
          description: "Luxurious suite with separate living area"
        }
      ]
    },
    {
      id: "2", 
      name: "Santorini Sunset Resort",
      location: "Oia, Santorini",
      rating: 4.9,
      price: 25000,
      image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&h=300&fit=crop",
      amenities: ["Ocean View", "Pool", "Spa", "Restaurant", "Beach Access"],
      description: "Stunning resort overlooking the Aegean Sea",
      rooms: [
        {
          type: "Sea View Room",
          price: 25000,
          image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300&h=200&fit=crop",
          description: "Room with breathtaking sea views"
        },
        {
          type: "Cave Suite",
          price: 40000,
          image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=300&h=200&fit=crop",
          description: "Traditional cave-style suite"
        }
      ]
    },
    {
      id: "3",
      name: "Alpine Lodge Swiss",
      location: "Zermatt, Switzerland",
      rating: 4.7,
      price: 18000,
      image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop",
      amenities: ["Mountain View", "Ski Access", "Spa", "Restaurant", "Fireplace"],
      description: "Cozy mountain lodge with stunning Alpine views",
      rooms: [
        {
          type: "Mountain Room",
          price: 18000,
          image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop",
          description: "Comfortable room with mountain views"
        },
        {
          type: "Alpine Suite",
          price: 28000,
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
          description: "Luxurious suite with panoramic views"
        }
      ]
    }
  ];

  const calculateTotal = () => {
    if (!selectedHotel || !selectedRoomType || !checkInDate || !checkOutDate) return 0;
    
    const room = selectedHotel.rooms.find(r => r.type === selectedRoomType);
    if (!room) return 0;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    return room.price * numberOfRooms * nights;
  };

  const totalAmount = calculateTotal();

  useEffect(() => {
    setBudgetExceeded(totalAmount > budgetLimit);
  }, [totalAmount, budgetLimit]);

  const handleBookHotel = () => {
    if (budgetExceeded) {
      alert("Budget exceeded! Please adjust your selection.");
      return;
    }
    
    const bookingData = {
      hotel: selectedHotel,
      roomType: selectedRoomType,
      numberOfRooms,
      checkInDate,
      checkOutDate,
      totalAmount,
      groupMembers
    };
    
    // Store booking data for payment page
    localStorage.setItem('hotelBookingData', JSON.stringify(bookingData));
    setLocation('/hotel-booking-success');
  };

  if (selectedHotel) {
    const selectedRoom = selectedHotel.rooms.find(r => r.type === selectedRoomType);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedHotel(null)}
              className="mr-3"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Book {selectedHotel.name}</h1>
          </div>

          {/* Budget Warning */}
          {budgetExceeded && (
            <Alert className="mb-6 border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                You have exceeded your budget limit of ${(budgetLimit / 100).toFixed(2)}. 
                Current total: ${(totalAmount / 100).toFixed(2)}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Booking Details */}
            <div className="space-y-6">
              {/* Group Members */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Group Members
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{groupMembers} guests</div>
                </CardContent>
              </Card>

              {/* Room Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bed className="h-5 w-5 mr-2" />
                    Select Rooms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Number of Rooms</label>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setNumberOfRooms(Math.max(1, numberOfRooms - 1))}
                      >
                        -
                      </Button>
                      <span className="px-4 py-2 border rounded">{numberOfRooms}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setNumberOfRooms(numberOfRooms + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Room Type</label>
                    <div className="space-y-3">
                      {selectedHotel.rooms.map((room) => (
                        <div
                          key={room.type}
                          className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                            selectedRoomType === room.type
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedRoomType(room.type)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium">{room.type}</h4>
                              <p className="text-sm text-gray-600 mt-1">{room.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">${(room.price / 100).toFixed(2)}</div>
                              <div className="text-sm text-gray-500">per night</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Check-in/Check-out */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Dates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Check-in Date</label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Check-out Date</label>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      min={checkInDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Room Image & Total */}
            <div className="space-y-6">
              {/* Room Image */}
              {selectedRoom && (
                <Card>
                  <CardContent className="p-0">
                    <img
                      src={selectedRoom.image}
                      alt={selectedRoom.type}
                      className="w-full h-64 object-cover rounded-t-lg"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{selectedRoom.type}</h3>
                      <p className="text-gray-600">{selectedRoom.description}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Total Amount */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Total Amount
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedRoom && (
                      <>
                        <div className="flex justify-between">
                          <span>Room rate (per night)</span>
                          <span>${(selectedRoom.price / 100).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Number of rooms</span>
                          <span>{numberOfRooms}</span>
                        </div>
                        {checkInDate && checkOutDate && (
                          <div className="flex justify-between">
                            <span>Number of nights</span>
                            <span>
                              {Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24))}
                            </span>
                          </div>
                        )}
                        <hr className="my-2" />
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total</span>
                          <span className={budgetExceeded ? 'text-red-600' : 'text-green-600'}>
                            ${(totalAmount / 100).toFixed(2)}
                          </span>
                        </div>
                        {budgetExceeded && (
                          <div className="text-sm text-red-600">
                            Budget limit: ${(budgetLimit / 100).toFixed(2)}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Book Button */}
              <Button
                onClick={handleBookHotel}
                disabled={!selectedRoomType || !checkInDate || !checkOutDate || budgetExceeded}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Book Hotel
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/booking-flow")}
            className="mr-3"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Select Hotel</h1>
        </div>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <Card
              key={hotel.id}
              className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
              onClick={() => setSelectedHotel(hotel)}
            >
              <CardContent className="p-0">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{hotel.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-sm">{hotel.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{hotel.location}</span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{hotel.description}</p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {hotel.amenities.slice(0, 3).map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {hotel.amenities.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{hotel.amenities.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-lg font-bold">
                        ${(hotel.price / 100).toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500"> /night</span>
                    </div>
                    <Button size="sm">Select</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotelBooking;