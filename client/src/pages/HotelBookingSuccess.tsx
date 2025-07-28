import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";

const HotelBookingSuccess = () => {
  const [, setLocation] = useLocation();
  const [bookingData, setBookingData] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('hotelBookingData');
    if (stored) {
      setBookingData(JSON.parse(stored));
    }
  }, []);

  const handleMoveToPayment = () => {
    setLocation('/trip-payment-summary');
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Hotel Booking Successful!</h1>
          <p className="text-gray-600">Your hotel reservation has been confirmed</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-6 w-6" />
              Booking Confirmed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-6">
                <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Hotel Successfully Booked!</h3>
                <p className="text-gray-600">Your hotel reservation is confirmed and ready</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Booking Details</h4>
                <div className="space-y-2 text-sm text-green-700">
                  <div className="flex justify-between">
                    <span>Hotel:</span>
                    <span className="font-medium">{bookingData.hotel?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Room Type:</span>
                    <span className="font-medium">{bookingData.roomType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rooms:</span>
                    <span className="font-medium">{bookingData.numberOfRooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-in:</span>
                    <span className="font-medium">{new Date(bookingData.checkInDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-out:</span>
                    <span className="font-medium">{new Date(bookingData.checkOutDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-medium">${(bookingData.totalAmount / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Next Step</h4>
                <p className="text-sm text-blue-700">
                  Complete your trip by making the final payment for all services including transportation, hotels, activities, and taxes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={handleMoveToPayment}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
          size="lg"
        >
          Move to Payment Making
        </Button>
      </div>
    </div>
  );
};

export default HotelBookingSuccess;