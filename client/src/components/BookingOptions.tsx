
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Star,
  Clock,
  Users,
  Wifi,
  Coffee,
  Zap
} from "lucide-react";

interface BookingOptionsProps {
  isOpen: boolean;
  onClose: () => void;
  onBookNow: (option: BookingOption) => void;
}

interface BookingOption {
  id: string;
  provider: string;
  price: number;
  rating: number;
  duration: string;
  departureTime: string;
  arrivalTime: string;
  seatType: string;
  comfort: string;
  amenities: string[];
}

const sampleOptions: BookingOption[] = [
  {
    id: '1',
    provider: 'AirMax Airlines',
    price: 299,
    rating: 4.5,
    duration: '2h 30m',
    departureTime: '08:00',
    arrivalTime: '10:30',
    seatType: 'Economy',
    comfort: 'Standard',
    amenities: ['WiFi', 'Snacks', 'Entertainment']
  },
  {
    id: '2',
    provider: 'SkyLine Airways',
    price: 450,
    rating: 4.8,
    duration: '2h 15m',
    departureTime: '14:30',
    arrivalTime: '16:45',
    seatType: 'Business',
    comfort: 'Premium',
    amenities: ['WiFi', 'Meals', 'Priority Boarding', 'Extra Legroom']
  },
  {
    id: '3',
    provider: 'QuickJet',
    price: 199,
    rating: 4.2,
    duration: '2h 45m',
    departureTime: '19:00',
    arrivalTime: '21:45',
    seatType: 'Economy',
    comfort: 'Basic',
    amenities: ['Snacks']
  }
];

const BookingOptions = ({ isOpen, onClose, onBookNow }: BookingOptionsProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const getComfortColor = (comfort: string) => {
    switch (comfort) {
      case 'Premium': return 'bg-purple-100 text-purple-800';
      case 'Standard': return 'bg-blue-100 text-blue-800';
      case 'Basic': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Available Flight Options</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-gray-600">Select from available options for your journey:</p>
          
          {sampleOptions.map((option) => (
            <Card key={option.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{option.provider}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center">
                        {renderStars(option.rating)}
                        <span className="ml-1 text-sm text-gray-600">{option.rating}</span>
                      </div>
                      <Badge variant="outline" className={getComfortColor(option.comfort)}>
                        {option.comfort}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">${option.price}</div>
                    <div className="text-sm text-gray-500">per person</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-sm font-medium">Duration</div>
                      <div className="text-sm text-gray-600">{option.duration}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-sm font-medium">Seat Type</div>
                      <div className="text-sm text-gray-600">{option.seatType}</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-1">Schedule</div>
                    <div className="text-sm text-gray-600">
                      {option.departureTime} - {option.arrivalTime}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-medium mb-2">Amenities</div>
                  <div className="flex flex-wrap gap-2">
                    {option.amenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={() => onBookNow(option)}
                  className="w-full md:w-auto"
                >
                  Book Now - ${option.price}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingOptions;
