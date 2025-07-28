import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TransportPayment from "./TransportPayment";
import { 
  Car, 
  Ticket, 
  Hotel, 
  MapPin, 
  Calendar,
  Clock,
  Users,
  CreditCard,
  Plane
} from "lucide-react";

interface AIBookingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIBookings = ({ isOpen, onClose }: AIBookingsProps) => {
  const [activeTab, setActiveTab] = useState<'taxi' | 'tickets' | 'other'>('taxi');
  const [showPayment, setShowPayment] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<any>(null);
  const [bookingData, setBookingData] = useState({
    pickup: '',
    dropoff: '',
    date: '',
    time: '',
    passengers: '1',
    ticketType: '',
    destination: '',
    quantity: '1'
  });

  const handleBooking = (type: string, serviceData?: any) => {
    let bookingDetails;
    
    if (activeTab === 'taxi') {
      bookingDetails = {
        type: 'taxi',
        serviceName: type,
        description: `Taxi service from ${bookingData.pickup || 'Current Location'} to ${bookingData.dropoff || 'Destination'}`,
        amount: Math.floor(Math.random() * 500) + 200, // Random amount between 200-700
        details: {
          pickup: bookingData.pickup,
          dropoff: bookingData.dropoff,
          date: bookingData.date,
          time: bookingData.time,
          passengers: bookingData.passengers,
          vehicleType: type
        }
      };
    } else if (activeTab === 'tickets') {
      bookingDetails = {
        type: 'ticket',
        serviceName: type,
        description: `${type} for ${bookingData.destination || 'your destination'}`,
        amount: Math.floor(Math.random() * 2000) + 500, // Random amount between 500-2500
        details: {
          destination: bookingData.destination,
          quantity: bookingData.quantity,
          ticketType: type
        }
      };
    } else if (activeTab === 'other') {
      bookingDetails = {
        type: 'service',
        serviceName: type,
        description: `${type} booking service`,
        amount: Math.floor(Math.random() * 1500) + 300, // Random amount between 300-1800
        details: {
          serviceType: type,
          bookingData: bookingData
        }
      };
    }

    setCurrentBooking(bookingDetails);
    setShowPayment(true);
  };

  const handlePaymentClose = () => {
    setShowPayment(false);
    setCurrentBooking(null);
    onClose(); // Close the main booking dialog too
  };

  const updateBookingData = (field: string, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const taxiOptions = [
    { id: 'economy', name: 'Economy', price: '$15-25', time: '5-10 min', icon: Car },
    { id: 'comfort', name: 'Comfort', price: '$20-35', time: '5-10 min', icon: Car },
    { id: 'premium', name: 'Premium', price: '$35-50', time: '3-8 min', icon: Car }
  ];

  const ticketTypes = [
    { id: 'flight', name: 'Flight Tickets', icon: Plane, description: 'Domestic & International flights' },
    { id: 'train', name: 'Train Tickets', icon: Ticket, description: 'High-speed & local trains' },
    { id: 'bus', name: 'Bus Tickets', icon: Car, description: 'City & intercity buses' },
    { id: 'event', name: 'Event Tickets', icon: Ticket, description: 'Concerts, shows & attractions' }
  ];

  const otherServices = [
    { id: 'hotel', name: 'Hotel Booking', icon: Hotel, description: 'Find and book accommodations' },
    { id: 'restaurant', name: 'Restaurant Reservations', icon: MapPin, description: 'Reserve tables at top restaurants' },
    { id: 'activity', name: 'Activities & Tours', icon: Ticket, description: 'Book experiences and guided tours' }
  ];

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <span>AI Bookings Assistant</span>
          </DialogTitle>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex space-x-2 border-b">
          <Button
            variant={activeTab === 'taxi' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('taxi')}
            className="flex-1"
          >
            <Car className="w-4 h-4 mr-2" />
            Taxi
          </Button>
          <Button
            variant={activeTab === 'tickets' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('tickets')}
            className="flex-1"
          >
            <Ticket className="w-4 h-4 mr-2" />
            Tickets
          </Button>
          <Button
            variant={activeTab === 'other' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('other')}
            className="flex-1"
          >
            <Hotel className="w-4 h-4 mr-2" />
            Other
          </Button>
        </div>

        {/* Taxi Booking */}
        {activeTab === 'taxi' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pickup">Pickup Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="pickup"
                    placeholder="Enter pickup address"
                    className="pl-10"
                    value={bookingData.pickup}
                    onChange={(e) => updateBookingData('pickup', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dropoff">Drop-off Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="dropoff"
                    placeholder="Enter destination"
                    className="pl-10"
                    value={bookingData.dropoff}
                    onChange={(e) => updateBookingData('dropoff', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="date"
                    type="date"
                    className="pl-10"
                    value={bookingData.date}
                    onChange={(e) => updateBookingData('date', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="time"
                    type="time"
                    className="pl-10"
                    value={bookingData.time}
                    onChange={(e) => updateBookingData('time', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Choose Your Ride</h4>
              <div className="grid gap-4">
                {taxiOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <Card key={option.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                              <IconComponent className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                              <h5 className="font-medium">{option.name}</h5>
                              <p className="text-sm text-gray-600">{option.time} away</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{option.price}</p>
                            <Button 
                              size="sm" 
                              onClick={() => handleBooking(`${option.name} Taxi`)}
                              className="mt-2"
                            >
                              Book Now
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Ticket Booking */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ticketTypes.map((ticket) => {
                const IconComponent = ticket.icon;
                return (
                  <Card key={ticket.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{ticket.name}</h4>
                          <p className="text-sm text-gray-600 font-normal">{ticket.description}</p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={() => handleBooking(ticket.name)}
                        className="w-full"
                      >
                        Book {ticket.name}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card>
              <CardContent className="p-4 space-y-4">
                <h4 className="font-semibold">Quick Booking Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination/Event</Label>
                    <Input
                      id="destination"
                      placeholder="Where are you going?"
                      value={bookingData.destination}
                      onChange={(e) => updateBookingData('destination', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Number of Tickets</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        className="pl-10"
                        value={bookingData.quantity}
                        onChange={(e) => updateBookingData('quantity', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Other Services */}
        {activeTab === 'other' && (
          <div className="space-y-6">
            <div className="grid gap-4">
              {otherServices.map((service) => {
                const IconComponent = service.icon;
                return (
                  <Card key={service.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg">{service.name}</h4>
                            <p className="text-gray-600">{service.description}</p>
                          </div>
                        </div>
                        <Button 
                          onClick={() => handleBooking(service.name)}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                          Book Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="bg-gradient-to-r from-orange-50 to-red-50">
              <CardContent className="p-6 text-center">
                <CreditCard className="w-12 h-12 mx-auto mb-4 text-orange-600" />
                <h4 className="font-semibold text-lg mb-2">Secure Payment</h4>
                <p className="text-gray-600 mb-4">All bookings are protected with encrypted payment processing</p>
                <Badge variant="outline" className="bg-white">
                  256-bit SSL Encryption
                </Badge>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
    
    {/* Payment Dialog */}
    {showPayment && currentBooking && (
      <TransportPayment
        isOpen={showPayment}
        onClose={handlePaymentClose}
        bookingDetails={currentBooking}
      />
    )}
    </>
  );
};

export default AIBookings;
