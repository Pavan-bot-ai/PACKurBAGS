import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, Train, Car, Bus, Star, Clock, Users, Wifi, Coffee } from "lucide-react";

interface TransportMode {
  id: string;
  name: string;
  icon: any;
  description: string;
  basePrice: number;
}

interface TransportOption {
  id: string;
  provider: string;
  price: number;
  rating: number;
  duration: string;
  departureTime: string;
  arrivalTime: string;
  seatClass: string;
  comfort: string;
  amenities: string[];
  availability: number;
}

interface TransportSelectionProps {
  onModeSelect: (mode: string) => void;
  selectedMode: string | null;
  onOptionSelect: (option: TransportOption) => void;
  selectedOption: TransportOption | null;
  onNext: () => void;
}

const TransportSelection = ({ 
  onModeSelect, 
  selectedMode, 
  onOptionSelect, 
  selectedOption, 
  onNext 
}: TransportSelectionProps) => {
  const [showOptions, setShowOptions] = useState(false);

  const transportModes: TransportMode[] = [
    {
      id: "flight",
      name: "Flight",
      icon: Plane,
      description: "Fastest way to reach your destination",
      basePrice: 450
    },
    {
      id: "train",
      name: "Train",
      icon: Train,
      description: "Comfortable and scenic journey",
      basePrice: 120
    },
    {
      id: "bus",
      name: "Bus",
      icon: Bus,
      description: "Budget-friendly travel option",
      basePrice: 50
    },
    {
      id: "car",
      name: "Car Rental",
      icon: Car,
      description: "Freedom to explore at your own pace",
      basePrice: 200
    }
  ];

  const generateOptions = (mode: string): TransportOption[] => {
    const baseOptions = {
      flight: [
        {
          id: "flight-1",
          provider: "SkyHigh Airlines",
          price: 450,
          rating: 4.5,
          duration: "2h 30m",
          departureTime: "08:00",
          arrivalTime: "10:30",
          seatClass: "Economy",
          comfort: "Standard",
          amenities: ["In-flight meal", "Entertainment", "WiFi"],
          availability: 12
        },
        {
          id: "flight-2",
          provider: "CloudWings",
          price: 680,
          rating: 4.8,
          duration: "2h 15m",
          departureTime: "14:00",
          arrivalTime: "16:15",
          seatClass: "Business",
          comfort: "Premium",
          amenities: ["Premium meal", "Lounge access", "WiFi", "Priority boarding"],
          availability: 6
        },
        {
          id: "flight-3",
          provider: "Budget Air",
          price: 320,
          rating: 4.1,
          duration: "3h 10m",
          departureTime: "19:00",
          arrivalTime: "22:10",
          seatClass: "Economy",
          comfort: "Basic",
          amenities: ["Snacks", "Entertainment"],
          availability: 8
        }
      ],
      train: [
        {
          id: "train-1",
          provider: "Express Railways",
          price: 120,
          rating: 4.3,
          duration: "6h 45m",
          departureTime: "07:30",
          arrivalTime: "14:15",
          seatClass: "Second Class",
          comfort: "Standard",
          amenities: ["Dining car", "WiFi", "Power outlets"],
          availability: 20
        },
        {
          id: "train-2",
          provider: "Luxury Rails",
          price: 250,
          rating: 4.7,
          duration: "5h 30m",
          departureTime: "09:00",
          arrivalTime: "14:30",
          seatClass: "First Class",
          comfort: "Premium",
          amenities: ["Fine dining", "WiFi", "Reclining seats", "Personal attendant"],
          availability: 10
        }
      ],
      bus: [
        {
          id: "bus-1",
          provider: "Comfort Coach",
          price: 50,
          rating: 4.0,
          duration: "8h 30m",
          departureTime: "06:00",
          arrivalTime: "14:30",
          seatClass: "Standard",
          comfort: "Basic",
          amenities: ["AC", "Reclining seats"],
          availability: 15
        },
        {
          id: "bus-2",
          provider: "Premium Travel",
          price: 85,
          rating: 4.4,
          duration: "7h 45m",
          departureTime: "08:30",
          arrivalTime: "16:15",
          seatClass: "Sleeper",
          comfort: "Enhanced",
          amenities: ["AC", "WiFi", "Meals", "Entertainment"],
          availability: 12
        }
      ],
      car: [
        {
          id: "car-1",
          provider: "RentACar",
          price: 200,
          rating: 4.2,
          duration: "Self-drive",
          departureTime: "Flexible",
          arrivalTime: "Flexible",
          seatClass: "Compact",
          comfort: "Standard",
          amenities: ["GPS", "AC", "Bluetooth"],
          availability: 5
        },
        {
          id: "car-2",
          provider: "Luxury Rentals",
          price: 350,
          rating: 4.6,
          duration: "Self-drive",
          departureTime: "Flexible",
          arrivalTime: "Flexible",
          seatClass: "Premium SUV",
          comfort: "Luxury",
          amenities: ["GPS", "AC", "Leather seats", "Premium sound"],
          availability: 3
        }
      ]
    };

    return baseOptions[mode as keyof typeof baseOptions] || [];
  };

  const handleModeSelect = (mode: string) => {
    onModeSelect(mode);
    setShowOptions(true);
  };

  const handleBookTicket = (option: TransportOption) => {
    onOptionSelect(option);
  };

  const transportOptions = selectedMode ? generateOptions(selectedMode) : [];

  return (
    <div className="space-y-6">
      {!selectedMode && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Choose Your Transport Mode</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transportModes.map((mode) => {
              const IconComponent = mode.icon;
              return (
                <Card 
                  key={mode.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleModeSelect(mode.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-8 w-8 text-blue-600" />
                        <CardTitle className="text-lg">{mode.name}</CardTitle>
                      </div>
                      <Badge variant="secondary">From ${mode.basePrice}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{mode.description}</p>
                    <Button className="w-full mt-3" variant="outline">
                      Book Ticket
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {selectedMode && showOptions && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Available Options</h3>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowOptions(false);
                onModeSelect("");
              }}
            >
              Change Mode
            </Button>
          </div>

          <div className="space-y-4">
            {transportOptions.map((option) => (
              <Card key={option.id} className="relative">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{option.provider}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm">{option.rating}</span>
                        </div>
                        <Badge variant="outline">{option.comfort}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">${option.price}</div>
                      <div className="text-sm text-gray-600">{option.seatClass}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{option.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {option.departureTime} - {option.arrivalTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{option.availability} seats left</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {option.amenities.map((amenity, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={() => handleBookTicket(option)}
                    disabled={option.availability === 0}
                  >
                    {option.availability === 0 ? "Sold Out" : "Book Now"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedOption && (
        <div className="mt-6">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-green-800">Selected Option</h4>
                  <p className="text-sm text-green-700">
                    {selectedOption.provider} - {selectedOption.seatClass} - ${selectedOption.price}
                  </p>
                </div>
                <Button onClick={onNext} className="bg-green-600 hover:bg-green-700">
                  Proceed to Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TransportSelection;