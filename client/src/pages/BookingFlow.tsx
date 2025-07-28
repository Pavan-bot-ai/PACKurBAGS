import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle, Plane, Building, CreditCard, FileText, MapPin } from "lucide-react";
import { useLocation } from "wouter";
import TransportSelection from "@/components/TransportSelection";
import TransportPayment from "@/components/TransportPayment";
import PaymentStatus from "@/components/PaymentStatus";
import FinalPlanPage from "@/components/FinalPlanPage";
import HappyJourneyPage from "@/components/HappyJourneyPage";
import { apiRequest } from "@/lib/queryClient";

interface BookingStep {
  id: number;
  title: string;
  icon: any;
  completed: boolean;
}

const BookingFlow = () => {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [transportMode, setTransportMode] = useState<string>("");
  const [selectedTransport, setSelectedTransport] = useState<any>(null);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [isTransportCompleted, setIsTransportCompleted] = useState(false);
  const [hotelBookingComplete, setHotelBookingComplete] = useState(false);
  const [showFinalPlan, setShowFinalPlan] = useState(false);
  const [showHappyJourney, setShowHappyJourney] = useState(false);
  const [planData, setPlanData] = useState<any>(null);

  const steps: BookingStep[] = [
    { id: 1, title: "Plan Selection", icon: FileText, completed: currentStep > 1 },
    { id: 2, title: "Transport Booking", icon: Plane, completed: isTransportCompleted },
    { id: 3, title: "Hotel Booking", icon: Building, completed: hotelBookingComplete },
    { id: 4, title: "Payment Summary", icon: CreditCard, completed: currentStep > 4 },
    { id: 5, title: "Final Plan", icon: CheckCircle, completed: currentStep > 5 }
  ];

  useEffect(() => {
    // Get selected plan from localStorage
    const planData = localStorage.getItem('selectedPlan');
    if (planData) {
      setSelectedPlan(JSON.parse(planData));
    }

    // Get step from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const step = urlParams.get('step');
    if (step) {
      const stepNumber = parseInt(step);
      setCurrentStep(stepNumber);
      
      // If we're on step 4 or later, it means hotel booking is complete
      if (stepNumber >= 4) {
        setHotelBookingComplete(true);
      }
    }

    // Check if hotel booking is complete from localStorage
    const hotelBookingStatus = localStorage.getItem('hotelBookingComplete');
    if (hotelBookingStatus === 'true') {
      setHotelBookingComplete(true);
    }

    // Check if returning from hotel booking
    const returnStep = localStorage.getItem('returnToBookingFlow');
    if (returnStep === 'step4') {
      setCurrentStep(4);
      setHotelBookingComplete(true);
      localStorage.removeItem('returnToBookingFlow'); // Clean up
      window.history.replaceState(null, '', `/booking-flow?step=4`);
    }
    
    // Check if we should show final plan from payment completion
    const showFinalPlanFlag = localStorage.getItem('showFinalPlanFromPayment');
    if (showFinalPlanFlag === 'true') {
      localStorage.removeItem('showFinalPlanFromPayment');
      
      // Set up the final plan data and show it
      const transportData = JSON.parse(localStorage.getItem('selectedTransport') || '{}');
      const hotelData = JSON.parse(localStorage.getItem('selectedHotel') || '{}');
      const storedPlan = JSON.parse(localStorage.getItem('selectedPlan') || '{}');
      
      // Calculate budget allocation
      const userBudget = storedPlan?.tripDetails?.budget || storedPlan?.budget || 5000;
      const budgetInCents = parseInt(userBudget) * 100;
      
      let hotelPercentage = 0.45;
      let transportPercentage = 0.35;
      let itineraryPercentage = 0.20;
      
      if (budgetInCents >= 1000000) {
        hotelPercentage = 0.55;
        transportPercentage = 0.30;
        itineraryPercentage = 0.15;
      } else if (budgetInCents >= 500000) {
        hotelPercentage = 0.50;
        transportPercentage = 0.32;
        itineraryPercentage = 0.18;
      } else if (budgetInCents >= 200000) {
        hotelPercentage = 0.45;
        transportPercentage = 0.35;
        itineraryPercentage = 0.20;
      } else {
        hotelPercentage = 0.40;
        transportPercentage = 0.40;
        itineraryPercentage = 0.20;
      }
      
      const calculatedHotelAmount = Math.round(budgetInCents * hotelPercentage);
      const calculatedTransportAmount = transportData?.price * 100 || Math.round(budgetInCents * transportPercentage);
      const calculatedItineraryAmount = Math.round(budgetInCents * itineraryPercentage);
      
      const finalPlanData = {
        planDetails: storedPlan?.tripDetails || {},
        transportDetails: transportData || {},
        hotelDetails: hotelData,
        itineraryDetails: storedPlan?.selectedPlan || {},
        paymentDetails: {
          transportAmount: calculatedTransportAmount,
          hotelAmount: calculatedHotelAmount,
          itineraryAmount: calculatedItineraryAmount,
          totalAmount: calculatedTransportAmount + calculatedHotelAmount + calculatedItineraryAmount,
          paymentMethod: 'Credit Card',
          budgetBreakdown: {
            totalBudget: budgetInCents,
            hotelPercentage: Math.round(hotelPercentage * 100),
            transportPercentage: Math.round(transportPercentage * 100),
            itineraryPercentage: Math.round(itineraryPercentage * 100)
          }
        }
      };
      
      setPlanData(finalPlanData);
      setCurrentStep(5);
      setIsTransportCompleted(true);
      setHotelBookingComplete(true);
      setShowFinalPlan(true);
    }
  }, []);

  const handleNextStep = () => {
    if (currentStep < 5) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      window.history.replaceState(null, '', `/booking-flow?step=${nextStep}`);
    }
  };

  const handleTransportPaymentComplete = (paymentDetails: any) => {
    setPaymentResult(paymentDetails);
    if (paymentDetails.status === "success") {
      setIsTransportCompleted(true);
    }
  };

  const handleTransportComplete = () => {
    setCurrentStep(3); // Move to hotel booking
    window.history.replaceState(null, '', `/booking-flow?step=3`);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      window.history.replaceState(null, '', `/booking-flow?step=${prevStep}`);
    }
  };

  const handleComplete = () => {
    // Save booking to localStorage or send to backend
    const bookingData = {
      ...selectedPlan,
      bookingId: `TRP-${Date.now()}`,
      status: 'confirmed',
      bookingDate: new Date().toISOString()
    };
    
    localStorage.setItem('latestBooking', JSON.stringify(bookingData));
    setLocation('/hotel-booking');
  };

  const handleHotelBookingComplete = () => {
    setHotelBookingComplete(true);
    setCurrentStep(5); // Move to final plan review
    window.history.replaceState(null, '', `/booking-flow?step=5`);
    
    // Calculate budget-based hotel allocation
    const userBudget = selectedPlan?.tripDetails?.budget || selectedPlan?.budget || 5000;
    const budgetInCents = parseInt(userBudget) * 100;
    
    // Budget-based allocation percentages
    let hotelPercentage = 0.45; // Default 45% for hotel
    let transportPercentage = 0.35; // Default 35% for transport
    let itineraryPercentage = 0.20; // Default 20% for activities
    
    // Adjust allocation based on budget range
    if (budgetInCents >= 1000000) { // $10,000+ - Luxury travel
      hotelPercentage = 0.55; // 55% for luxury hotels
      transportPercentage = 0.30; // 30% for premium transport
      itineraryPercentage = 0.15; // 15% for exclusive activities
    } else if (budgetInCents >= 500000) { // $5,000+ - Premium travel
      hotelPercentage = 0.50; // 50% for premium hotels
      transportPercentage = 0.32; // 32% for good transport
      itineraryPercentage = 0.18; // 18% for quality activities
    } else if (budgetInCents >= 200000) { // $2,000+ - Mid-range travel
      hotelPercentage = 0.45; // 45% for mid-range hotels
      transportPercentage = 0.35; // 35% for standard transport
      itineraryPercentage = 0.20; // 20% for standard activities
    } else { // Budget travel
      hotelPercentage = 0.40; // 40% for budget hotels
      transportPercentage = 0.40; // 40% for budget transport
      itineraryPercentage = 0.20; // 20% for budget activities
    }
    
    // Calculate amounts based on percentages
    const calculatedHotelAmount = Math.round(budgetInCents * hotelPercentage);
    const calculatedTransportAmount = selectedTransport?.price * 100 || Math.round(budgetInCents * transportPercentage);
    const calculatedItineraryAmount = Math.round(budgetInCents * itineraryPercentage);
    
    // Prepare final plan data
    const finalPlanData = {
      planDetails: selectedPlan?.tripDetails || {},
      transportDetails: selectedTransport || {},
      hotelDetails: JSON.parse(localStorage.getItem('selectedHotel') || '{}'),
      itineraryDetails: selectedPlan?.selectedPlan || {},
      paymentDetails: {
        transportAmount: calculatedTransportAmount,
        hotelAmount: calculatedHotelAmount,
        itineraryAmount: calculatedItineraryAmount,
        totalAmount: calculatedTransportAmount + calculatedHotelAmount + calculatedItineraryAmount,
        paymentMethod: 'Credit Card',
        budgetBreakdown: {
          totalBudget: budgetInCents,
          hotelPercentage: Math.round(hotelPercentage * 100),
          transportPercentage: Math.round(transportPercentage * 100),
          itineraryPercentage: Math.round(itineraryPercentage * 100)
        }
      }
    };
    
    setPlanData(finalPlanData);
    setShowFinalPlan(true);
  };

  const handleFinishBooking = async () => {
    try {
      // Create the booked plan data
      const bookedPlanData = {
        planTitle: `${planData.planDetails.destination} Adventure`,
        destination: planData.planDetails.destination || 'Bali, Indonesia',
        planDetails: JSON.stringify(planData.planDetails),
        transportDetails: JSON.stringify(planData.transportDetails),
        hotelDetails: JSON.stringify(planData.hotelDetails),
        itineraryDetails: JSON.stringify(planData.itineraryDetails),
        totalAmount: planData.paymentDetails.totalAmount,
        transportAmount: planData.paymentDetails.transportAmount,
        hotelAmount: planData.paymentDetails.hotelAmount,
        itineraryAmount: planData.paymentDetails.itineraryAmount,
        paymentMethod: planData.paymentDetails.paymentMethod,
        travelDate: planData.planDetails.startDate ? 
          new Date(planData.planDetails.startDate).toLocaleDateString() : 
          'Dec 25, 2024',
        duration: planData.planDetails.duration || '7 days'
      };

      // Save to backend via API
      const savedPlan = await apiRequest('POST', '/api/booked-plans', bookedPlanData);
      console.log('Plan saved successfully:', savedPlan);
      
      // Hide final plan and show happy journey
      setShowFinalPlan(false);
      setShowHappyJourney(true);
    } catch (error) {
      console.error('Error saving plan:', error);
      // Still show happy journey page even if there's an error
      setShowFinalPlan(false);
      setShowHappyJourney(true);
    }
  };

  const handleCloseHappyJourney = () => {
    setShowHappyJourney(false);
    setLocation('/booked-plans');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Confirm Your Selected Plan</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedPlan && (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{selectedPlan.selectedPlan.title}</h3>
                      <p className="text-gray-600 flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {selectedPlan.tripDetails.destination}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-0">
                      {selectedPlan.selectedPlan.feasibilityScore}% Feasible
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Duration:</span>
                      <span className="ml-2">{selectedPlan.selectedPlan.duration}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Travelers:</span>
                      <span className="ml-2">{selectedPlan.tripDetails.travelers} people</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Budget:</span>
                      <span className="ml-2">${selectedPlan.tripDetails.budget}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Estimated Cost:</span>
                      <span className="ml-2">{selectedPlan.selectedPlan.estimatedCost}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 2:
        // Show payment result if available
        if (paymentResult) {
          return (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Payment Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentStatus
                  paymentResult={paymentResult}
                  onContinue={handleTransportComplete}
                />
              </CardContent>
            </Card>
          );
        }
        
        // Show payment form if transport is selected
        if (selectedTransport) {
          return (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Transport Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TransportPayment
                  amount={selectedTransport.price}
                  onPaymentComplete={handleTransportPaymentComplete}
                  bookingDetails={selectedTransport}
                />
              </CardContent>
            </Card>
          );
        }
        
        // Show transport selection by default
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5" />
                Transport Booking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TransportSelection
                onModeSelect={setTransportMode}
                selectedMode={transportMode}
                onOptionSelect={setSelectedTransport}
                selectedOption={selectedTransport}
                onNext={() => {
                  // This callback is triggered when "Proceed to Payment" is clicked
                  // selectedTransport is already set, so the component will re-render
                  // and show the payment form
                }}
              />
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Transportation Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Transportation Booked!</h3>
                  <p className="text-gray-600">Your transport has been successfully booked. Now let's book your hotel.</p>
                </div>
                <Button 
                  onClick={() => {
                    // Set localStorage flag so when user comes back we know hotel booking is complete
                    localStorage.setItem('returnToBookingFlow', 'step4');
                    setLocation('/hotel-booking');
                  }} 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Continue to Hotel Booking
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        // Check if hotel booking is complete - this step represents hotel payment completion
        if (hotelBookingComplete) {
          return (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Hotel Booking Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Hotel Booking Successful!</h3>
                    <p className="text-gray-600">Your hotel has been successfully booked. All payments completed.</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Booking Reference</h4>
                    <p className="text-sm text-green-700">HTL-{Date.now()}</p>
                  </div>
                  <div className="text-center">
                    <Button 
                      onClick={() => setLocation('/trip-payment-summary')}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Continue to Payment
                      </div>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        }
        
        // Default step 4 content
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Booking Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Flight (Business Class)</span>
                      <span>$1,200</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hotel (6 nights)</span>
                      <span>$1,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Activities & Tours</span>
                      <span>$300</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-semibold">
                      <span>Total Amount</span>
                      <span>$3,000</span>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => setHotelBookingComplete(true)}
                  className="w-full"
                >
                  Proceed to Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Final Plan Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">All Bookings Complete!</h3>
                  <p className="text-gray-600">Review your complete travel plan and confirm your booking.</p>
                </div>
                <Button 
                  onClick={handleHotelBookingComplete} 
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  Review Final Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  const progressPercentage = (currentStep / 5) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/plan-generation")}
            className="mr-3"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Booking Process</h1>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Step {currentStep} of 5</span>
            <span className="text-sm text-gray-600">{Math.round(progressPercentage)}% Complete</span>
          </div>
          <Progress value={progressPercentage} className="mb-4" />
          
          {/* Step Indicators */}
          <div className="flex justify-between">
            {steps.map((step) => {
              const IconComponent = step.icon;
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.id === currentStep 
                      ? 'bg-blue-500 text-white' 
                      : step.completed 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-600'
                  }`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-1 text-center">{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {/* Only show Next button before transport booking completion (step 2) */}
          {currentStep === 1 && (
            <Button
              onClick={handleNextStep}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* Final Plan Page Modal */}
      {showFinalPlan && planData && (
        <FinalPlanPage
          isOpen={showFinalPlan}
          onClose={() => setShowFinalPlan(false)}
          planData={planData}
          onFinishBooking={handleFinishBooking}
        />
      )}

      {/* Happy Journey Page Modal */}
      {showHappyJourney && (
        <HappyJourneyPage
          isOpen={showHappyJourney}
          onClose={handleCloseHappyJourney}
          planData={planData?.planDetails}
        />
      )}
    </div>
  );
};

export default BookingFlow;