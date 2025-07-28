import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Plane, 
  Hotel, 
  CreditCard,
  ChevronRight,
  Package,
  Star,
  Eye,
  ArrowLeft
} from "lucide-react";
import { useLocation } from 'wouter';

interface BookedPlan {
  id: number;
  planTitle: string;
  destination: string;
  planDetails: string;
  transportDetails: string;
  hotelDetails: string;
  itineraryDetails: string;
  totalAmount: number;
  transportAmount: number;
  hotelAmount: number;
  itineraryAmount: number;
  paymentMethod: string;
  bookingStatus: string;
  travelDate: string;
  duration: string;
  createdAt: string;
}

const BookedPlans = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<BookedPlan | null>(null);
  const [, setLocation] = useLocation();



  const { data: bookedPlans = [], isLoading, error } = useQuery({
    queryKey: ['/api/booked-plans'],
    enabled: isAuthenticated && !authLoading,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100);
  };

  const parseItineraryDetails = (details: string) => {
    try {
      const parsed = JSON.parse(details);
      if (parsed.itinerary && Array.isArray(parsed.itinerary)) {
        return parsed.itinerary.map((day: any, index: number) => (
          <div key={index} className="mb-3 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Day {day.day}</h4>
            <ul className="list-disc list-inside space-y-1">
              {day.activities?.map((activity: string, actIndex: number) => (
                <li key={actIndex} className="text-gray-600 text-sm">{activity}</li>
              ))}
            </ul>
          </div>
        ));
      }
      if (parsed.highlights && Array.isArray(parsed.highlights)) {
        return (
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-800">Trip Highlights:</h4>
            <ul className="list-disc list-inside space-y-1">
              {parsed.highlights.map((highlight: string, index: number) => (
                <li key={index} className="text-gray-600 text-sm">{highlight}</li>
              ))}
            </ul>
          </div>
        );
      }
      return <p className="text-gray-600 text-sm">{parsed.title || 'Adventure activities included'}</p>;
    } catch (error) {
      return <p className="text-gray-500 text-sm">Activity details unavailable</p>;
    }
  };

  const parseTransportDetails = (details: string) => {
    try {
      const parsed = JSON.parse(details);
      if (Object.keys(parsed).length === 0) {
        return <p className="text-gray-500 text-sm">Transport details will be available after booking</p>;
      }
      return (
        <div className="space-y-1">
          {parsed.mode && <p className="text-sm text-gray-600">Mode: {parsed.mode}</p>}
          {parsed.from && <p className="text-sm text-gray-600">From: {parsed.from}</p>}
          {parsed.to && <p className="text-sm text-gray-600">To: {parsed.to}</p>}
          {parsed.date && <p className="text-sm text-gray-600">Date: {new Date(parsed.date).toLocaleDateString()}</p>}
        </div>
      );
    } catch (error) {
      return <p className="text-gray-500 text-sm">Transport details unavailable</p>;
    }
  };

  const parseHotelDetails = (details: string) => {
    try {
      const parsed = JSON.parse(details);
      if (Object.keys(parsed).length === 0) {
        return <p className="text-gray-500 text-sm">Hotel details will be available after booking</p>;
      }
      return (
        <div className="space-y-1">
          {parsed.name && <p className="text-sm text-gray-600">Hotel: {parsed.name}</p>}
          {parsed.room && <p className="text-sm text-gray-600">Room: {parsed.room}</p>}
          {parsed.checkin && <p className="text-sm text-gray-600">Check-in: {new Date(parsed.checkin).toLocaleDateString()}</p>}
          {parsed.checkout && <p className="text-sm text-gray-600">Check-out: {new Date(parsed.checkout).toLocaleDateString()}</p>}
        </div>
      );
    } catch (error) {
      return <p className="text-gray-500 text-sm">Hotel details unavailable</p>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg text-gray-600">Checking authentication...</span>
        </div>
      </div>
    );
  }

  // Show sign in prompt only after auth check is complete and user is not authenticated
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <Package className="w-12 h-12 mx-auto text-blue-500 mb-4" />
            <CardTitle>Please Sign In</CardTitle>
            <CardDescription>
              You need to be signed in to view your booked plans
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={() => setLocation('/')}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
            >
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading while data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg text-gray-600">Loading your travel plans...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setLocation('/')}
              className="flex items-center gap-2 hover:bg-blue-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Menu
            </Button>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <Package className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Booked Plans</h1>
              <p className="text-gray-600 text-lg">Manage and view your travel bookings</p>
            </div>
          </div>
          
          {bookedPlans.length > 0 && (
            <Card className="bg-white/70 backdrop-blur-sm border-blue-200">
              <CardContent className="py-4">
                <div className="flex items-center gap-6 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">Total Plans: {bookedPlans.length}</span>
                  </div>
                  <Separator orientation="vertical" className="h-4" />
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="font-medium">Confirmed: {bookedPlans.filter((p: BookedPlan) => p.bookingStatus === 'confirmed').length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Plans Grid */}
        {bookedPlans.length === 0 ? (
          <Card className="max-w-lg mx-auto shadow-lg">
            <CardHeader className="text-center py-12">
              <Package className="w-20 h-20 mx-auto text-gray-400 mb-6" />
              <CardTitle className="text-2xl text-gray-700 mb-2">No Plans Yet</CardTitle>
              <CardDescription className="text-lg text-gray-500">
                Start planning your next adventure! Your booked plans will appear here.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-12">
              <Button 
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 px-8 py-3 text-lg"
                onClick={() => setLocation('/smart-trip-planner')}
              >
                <MapPin className="w-5 h-5 mr-2" />
                Plan New Trip
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {bookedPlans.map((plan: BookedPlan) => (
              <Card key={plan.id} className="hover:shadow-xl transition-all duration-300 cursor-pointer group bg-white/80 backdrop-blur-sm border-gray-200 hover:border-blue-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-3 line-clamp-2 text-gray-800 group-hover:text-blue-600 transition-colors">
                        {plan.planTitle}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">{plan.destination}</span>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(plan.bookingStatus)} border shadow-sm`}>
                      {plan.bookingStatus}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Travel Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <p className="text-xs text-gray-600 font-medium">Travel Date</p>
                      </div>
                      <p className="font-semibold text-gray-800">{plan.travelDate}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-purple-500" />
                        <p className="text-xs text-gray-600 font-medium">Duration</p>
                      </div>
                      <p className="font-semibold text-gray-800">{plan.duration}</p>
                    </div>
                  </div>

                  {/* Booking Components */}
                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Plane className="w-4 h-4 text-blue-500" />
                        <span className="font-medium text-gray-700">Transport</span>
                      </div>
                      <span className="font-bold text-blue-600">{formatCurrency(plan.transportAmount)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Hotel className="w-4 h-4 text-orange-500" />
                        <span className="font-medium text-gray-700">Hotel</span>
                      </div>
                      <span className="font-bold text-orange-600">{formatCurrency(plan.hotelAmount)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-medium text-gray-700">Activities</span>
                      </div>
                      <span className="font-bold text-yellow-600">{formatCurrency(plan.itineraryAmount)}</span>
                    </div>
                    
                    <Separator className="my-3" />
                    
                    <div className="flex items-center justify-between text-lg font-bold bg-green-50 p-2 rounded">
                      <span className="text-gray-800">Total Amount</span>
                      <span className="text-green-600">{formatCurrency(plan.totalAmount)}</span>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                    <CreditCard className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">Paid via {plan.paymentMethod}</span>
                  </div>

                  {/* Action Button */}
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-blue-50 group-hover:border-blue-300 transition-all duration-200 py-3"
                    onClick={() => setSelectedPlan(plan)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Full Details
                    <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                  </Button>

                  {/* Booking Date */}
                  <p className="text-xs text-gray-500 text-center bg-gray-100 py-2 rounded">
                    Booked on {formatDate(plan.createdAt)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Plan Details Modal */}
        {selectedPlan && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-8 py-6 flex items-center justify-between rounded-t-2xl">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-1">{selectedPlan.planTitle}</h2>
                  <p className="text-gray-600 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {selectedPlan.destination}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedPlan(null)}
                  className="hover:bg-gray-100 rounded-full w-10 h-10 p-0"
                >
                  ✕
                </Button>
              </div>
              
              <div className="p-8 space-y-8">
                {/* Plan Overview */}
                <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-800">Trip Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500 font-medium mb-1">Destination</p>
                        <p className="font-bold text-lg text-gray-800">{selectedPlan.destination}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500 font-medium mb-1">Travel Date</p>
                        <p className="font-bold text-lg text-gray-800">{selectedPlan.travelDate}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500 font-medium mb-1">Duration</p>
                        <p className="font-bold text-lg text-gray-800">{selectedPlan.duration}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Plane className="w-5 h-5 text-blue-500" />
                        Transportation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-blue-600">{formatCurrency(selectedPlan.transportAmount)}</p>
                      {selectedPlan.transportDetails && (
                        <div className="mt-2">
                          {parseTransportDetails(selectedPlan.transportDetails)}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Hotel className="w-5 h-5 text-orange-500" />
                        Accommodation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-orange-600">{formatCurrency(selectedPlan.hotelAmount)}</p>
                      {selectedPlan.hotelDetails && (
                        <div className="mt-2">
                          {parseHotelDetails(selectedPlan.hotelDetails)}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        Activities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-yellow-600">{formatCurrency(selectedPlan.itineraryAmount)}</p>
                      {selectedPlan.itineraryDetails && (
                        <div className="mt-2">
                          {parseItineraryDetails(selectedPlan.itineraryDetails)}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Total and Payment */}
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
                  <CardContent className="pt-8 pb-8">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Summary</h3>
                      <div className="w-16 h-1 bg-green-500 mx-auto rounded"></div>
                    </div>
                    <div className="flex items-center justify-between text-3xl font-bold mb-4 bg-white p-4 rounded-lg shadow-sm">
                      <span className="text-gray-800">Total Amount Paid</span>
                      <span className="text-green-600">{formatCurrency(selectedPlan.totalAmount)}</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-gray-700 bg-white p-3 rounded-lg shadow-sm">
                      <CreditCard className="w-5 h-5 text-green-500" />
                      <span className="font-semibold">Payment Method: {selectedPlan.paymentMethod}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookedPlans;