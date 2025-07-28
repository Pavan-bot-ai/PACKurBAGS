import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, Calendar, MapPin, Users, DollarSign, Home } from "lucide-react";
import { useLocation } from "wouter";

const BookingSuccess = () => {
  const [, setLocation] = useLocation();
  const [bookingData, setBookingData] = useState<any>(null);

  useEffect(() => {
    const latestBooking = localStorage.getItem('latestBooking');
    if (latestBooking) {
      setBookingData(JSON.parse(latestBooking));
    }
  }, []);

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">Your trip has been successfully booked and confirmed</p>
        </div>

        {/* Booking Reference */}
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="font-semibold text-green-800 mb-2">Booking Reference Number</h3>
              <p className="text-2xl font-bold text-green-700">{bookingData.bookingId}</p>
              <p className="text-sm text-green-600 mt-1">Save this reference for future communications</p>
            </div>
          </CardContent>
        </Card>

        {/* Trip Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Trip Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">{bookingData.selectedPlan.title}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{bookingData.tripDetails.destination}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{bookingData.tripDetails.startDate} - {bookingData.tripDetails.endDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>{bookingData.tripDetails.travelers} travelers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span>Budget: ${bookingData.tripDetails.budget}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Trip Highlights</h4>
                <ul className="space-y-1 text-sm">
                  {bookingData.selectedPlan.highlights.map((highlight: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-medium">Check Your Email</h4>
                  <p className="text-sm text-gray-600">You'll receive a confirmation email with your booking details and tickets within 24 hours.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-medium">Prepare for Your Trip</h4>
                  <p className="text-sm text-gray-600">Review your itinerary and start preparing for your amazing adventure.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-medium">Track Your Booking</h4>
                  <p className="text-sm text-gray-600">Use the "Booked Plans" section in the menu to manage your trip.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            variant="outline"
            onClick={() => setLocation("/booked-plans")}
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            View Booked Plans
          </Button>
          <Button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;