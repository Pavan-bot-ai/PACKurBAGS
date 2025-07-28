
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plane, 
  Train, 
  Bus, 
  Car,
  Star,
  Clock,
  Users,
  ArrowRight
} from "lucide-react";

interface TransportationBookingProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingComplete: () => void;
}

interface TransportOption {
  id: string;
  name: string;
  icon: any;
  description: string;
}

const transportModes: TransportOption[] = [
  {
    id: 'flight',
    name: 'Flight',
    icon: Plane,
    description: 'Fast and convenient air travel'
  },
  {
    id: 'train',
    name: 'Train',
    icon: Train,
    description: 'Comfortable rail journey'
  },
  {
    id: 'bus',
    name: 'Bus',
    icon: Bus,
    description: 'Budget-friendly road travel'
  },
  {
    id: 'car',
    name: 'Car Rental',
    icon: Car,
    description: 'Flexible self-drive option'
  }
];

const TransportationBooking = ({ isOpen, onClose, onBookingComplete }: TransportationBookingProps) => {
  const [selectedTransport, setSelectedTransport] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);

  const handleTransportSelect = (transportId: string) => {
    setSelectedTransport(transportId);
    setShowOptions(true);
  };

  const handleBookTicket = () => {
    // This will be handled by parent component to show booking options
    onBookingComplete();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Transportation Mode</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-gray-600">Choose your preferred mode of transportation for this trip:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transportModes.map((transport) => {
              const IconComponent = transport.icon;
              const isSelected = selectedTransport === transport.id;
              
              return (
                <Card 
                  key={transport.id} 
                  className={`cursor-pointer transition-all ${
                    isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                  }`}
                  onClick={() => handleTransportSelect(transport.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full ${
                        isSelected ? 'bg-blue-500' : 'bg-gray-200'
                      } flex items-center justify-center`}>
                        <IconComponent className={`w-5 h-5 ${
                          isSelected ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <CardTitle className="text-lg">{transport.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{transport.description}</p>
                    {isSelected && (
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookTicket();
                        }}
                        className="w-full"
                      >
                        Book Ticket
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransportationBooking;
