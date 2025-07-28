import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Plane, 
  Hotel, 
  Route,
  CreditCard,
  CheckCircle,
  Sparkles
} from "lucide-react";

interface FinalPlanPageProps {
  isOpen: boolean;
  onClose: () => void;
  planData: {
    planDetails: any;
    transportDetails: any;
    hotelDetails: any;
    itineraryDetails: any;
    paymentDetails: {
      transportAmount: number;
      hotelAmount: number;
      itineraryAmount: number;
      totalAmount: number;
      paymentMethod: string;
    };
  };
  onFinishBooking: () => void;
}

const FinalPlanPage = ({ isOpen, onClose, planData, onFinishBooking }: FinalPlanPageProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleFinishBooking = async () => {
    setIsProcessing(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onFinishBooking();
    setIsProcessing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Final Plan Review
              </h2>
              <p className="text-gray-600">Review your complete travel plan before confirmation</p>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose} className="text-gray-500">
            ✕
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Plan Overview */}
          <Card className="border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Trip Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Departure:</span>
                  <span className="font-medium">{planData.planDetails?.travelDate || 'Dec 25, 2024'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Duration:</span>
                  <span className="font-medium">{planData.planDetails?.duration || '7 days'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Travelers:</span>
                  <span className="font-medium">{planData.planDetails?.travelers || '2 adults'}</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold mb-2">Destination</h4>
                <p className="text-lg font-bold text-blue-600">{planData.planDetails?.destination || 'Bali, Indonesia'}</p>
                <p className="text-gray-600 mt-1">{planData.planDetails?.description || 'Tropical paradise with stunning beaches, temples, and vibrant culture'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Plan Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="w-5 h-5 text-green-600" />
                Detailed Itinerary
              </CardTitle>
              <CardDescription>Your personalized travel plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {planData.itineraryDetails?.itinerary?.map((day: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-2">Day {day.day}</h4>
                    <div className="space-y-2">
                      {day.activities?.map((activity: any, actIndex: number) => (
                        <div key={actIndex} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="font-medium">{activity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )) || planData.itineraryDetails?.highlights ? (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-3">{planData.itineraryDetails?.title || 'Your Selected Plan'}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-blue-700 mb-2">Plan Highlights</h5>
                          <ul className="space-y-1">
                            {planData.itineraryDetails?.highlights?.map((highlight: string, index: number) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-blue-700 mb-2">Trip Details</h5>
                          <div className="space-y-1 text-sm">
                            <p><span className="font-medium">Duration:</span> {planData.itineraryDetails?.duration}</p>
                            <p><span className="font-medium">Feasibility Score:</span> {planData.itineraryDetails?.feasibilityScore}%</p>
                            <p><span className="font-medium">Estimated Cost:</span> {planData.itineraryDetails?.estimatedCost}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-gray-600">Detailed itinerary will be generated after booking confirmation</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Transportation Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="w-5 h-5 text-purple-600" />
                Transportation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{planData.transportDetails?.provider || 'Premium Airlines'}</p>
                    <p className="text-sm text-gray-600">{planData.transportDetails?.class || 'Economy Class'}</p>
                  </div>
                  <Badge variant="secondary">{planData.transportDetails?.status || 'Confirmed'}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Departure:</span>
                    <p className="font-medium">{planData.transportDetails?.departure || '08:30 AM'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Arrival:</span>
                    <p className="font-medium">{planData.transportDetails?.arrival || '14:45 PM'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hotel Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hotel className="w-5 h-5 text-orange-600" />
                Accommodation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{planData.hotelDetails?.name || 'Luxury Beach Resort'}</p>
                    <p className="text-sm text-gray-600">{planData.hotelDetails?.roomType || 'Deluxe Ocean View Room'}</p>
                  </div>
                  <Badge variant="secondary">{planData.hotelDetails?.status || 'Confirmed'}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Check-in:</span>
                    <p className="font-medium">{planData.hotelDetails?.checkIn || 'Dec 25, 2024'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Check-out:</span>
                    <p className="font-medium">{planData.hotelDetails?.checkOut || 'Jan 1, 2025'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Breakdown */}
          <Card className="border-2 border-green-100 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-600" />
                Payment Summary
              </CardTitle>
              {planData.paymentDetails?.budgetBreakdown && (
                <CardDescription>
                  Smart budget allocation based on your {formatCurrency(planData.paymentDetails.budgetBreakdown.totalBudget)} budget
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <span>Transportation</span>
                    {planData.paymentDetails?.budgetBreakdown && (
                      <Badge variant="outline" className="text-xs">
                        {planData.paymentDetails.budgetBreakdown.transportPercentage}%
                      </Badge>
                    )}
                  </div>
                  <span className="font-medium">{formatCurrency(planData.paymentDetails?.transportAmount || 89900)}</span>
                </div>
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <span>Accommodation</span>
                    {planData.paymentDetails?.budgetBreakdown && (
                      <Badge variant="outline" className="text-xs">
                        {planData.paymentDetails.budgetBreakdown.hotelPercentage}%
                      </Badge>
                    )}
                  </div>
                  <span className="font-medium">{formatCurrency(planData.paymentDetails?.hotelAmount || 149900)}</span>
                </div>
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <span>Itinerary & Activities</span>
                    {planData.paymentDetails?.budgetBreakdown && (
                      <Badge variant="outline" className="text-xs">
                        {planData.paymentDetails.budgetBreakdown.itineraryPercentage}%
                      </Badge>
                    )}
                  </div>
                  <span className="font-medium">{formatCurrency(planData.paymentDetails?.itineraryAmount || 29900)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-green-600">{formatCurrency(planData.paymentDetails?.totalAmount || 269700)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Payment Method: {planData.paymentDetails?.paymentMethod || 'Credit Card'}</span>
                </div>
                {planData.paymentDetails?.budgetBreakdown && (
                  <div className="bg-blue-50 rounded-lg p-3 mt-3">
                    <p className="text-sm text-blue-700 font-medium">💡 Smart Budget Allocation</p>
                    <p className="text-xs text-blue-600 mt-1">
                      We've optimized your spending based on your budget range to give you the best value for money.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Finish Booking Button */}
          <div className="flex justify-center pt-4">
            <Button 
              onClick={handleFinishBooking}
              disabled={isProcessing}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Finish Booking
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalPlanPage;