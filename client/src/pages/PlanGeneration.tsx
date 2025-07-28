import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, RefreshCw, CheckCircle, Star, MapPin, Calendar, Users, DollarSign } from "lucide-react";
import { useLocation } from "wouter";

interface TripPlan {
  id: number;
  title: string;
  duration: string;
  feasibilityScore: number;
  highlights: string[];
  itinerary: {
    day: number;
    activities: string[];
  }[];
  estimatedCost: string;
}

const PlanGeneration = () => {
  const [, setLocation] = useLocation();
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [plans, setPlans] = useState<TripPlan[]>([]);

  // Get trip details from localStorage
  const [tripDetails, setTripDetails] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    travelers: 0,
    budget: "",
    interest: "",
    duration: ""
  });

  useEffect(() => {
    const storedDetails = localStorage.getItem('currentTripDetails');
    if (storedDetails) {
      const details = JSON.parse(storedDetails);
      setTripDetails(details);
    }
  }, []);

  const generatePlans = () => {
    setIsGenerating(true);
    
    // Simulate AI plan generation based on user preferences
    setTimeout(() => {
      const baseActivities = {
        adventure: {
          activities: ["Mountain hiking", "River rafting", "Rock climbing", "Wildlife spotting"],
          types: ["Trekking expedition", "Adventure sports", "Nature exploration"]
        },
        pilgrimage: {
          activities: ["Sacred site visits", "Meditation sessions", "Prayer ceremonies", "Spiritual guidance"],
          types: ["Spiritual journey", "Sacred pilgrimage", "Religious exploration"]
        },
        relaxation: {
          activities: ["Spa treatments", "Beach lounging", "Yoga sessions", "Wellness activities"],
          types: ["Wellness retreat", "Beach resort", "Spa vacation"]
        },
        business: {
          activities: ["Conference attendance", "Networking events", "Business meetings", "Professional tours"],
          types: ["Business conference", "Corporate retreat", "Professional development"]
        }
      };

      const userPreference = baseActivities[tripDetails.interest as keyof typeof baseActivities] || baseActivities.adventure;
      
      const generatedPlans: TripPlan[] = [
        {
          id: 1,
          title: `${userPreference.types[0]} - ${tripDetails.destination}`,
          duration: tripDetails.duration,
          feasibilityScore: Math.floor(Math.random() * 15) + 85, // 85-100
          highlights: userPreference.activities,
          itinerary: Array.from({ length: parseInt(tripDetails.duration) || 5 }, (_, i) => ({
            day: i + 1,
            activities: [
              i === 0 ? "Arrival and check-in" : `Day ${i + 1} ${userPreference.activities[i % userPreference.activities.length]}`,
              i === 0 ? "Local orientation" : `${userPreference.activities[(i + 1) % userPreference.activities.length]} session`,
              i === parseInt(tripDetails.duration) - 1 ? "Departure preparations" : "Evening leisure time"
            ]
          })),
          estimatedCost: `$${Math.floor(parseInt(tripDetails.budget || "1000") * 0.8)} - $${tripDetails.budget}`
        },
        {
          id: 2,
          title: `${userPreference.types[1] || "Alternative"} - ${tripDetails.destination}`,
          duration: tripDetails.duration,
          feasibilityScore: Math.floor(Math.random() * 10) + 80, // 80-90
          highlights: [...userPreference.activities].reverse(),
          itinerary: Array.from({ length: parseInt(tripDetails.duration) || 5 }, (_, i) => ({
            day: i + 1,
            activities: [
              i === 0 ? "Arrival and setup" : `${userPreference.activities[i % userPreference.activities.length]} experience`,
              i === 0 ? "Welcome briefing" : `${userPreference.activities[(i + 2) % userPreference.activities.length]} activity`,
              i === parseInt(tripDetails.duration) - 1 ? "Departure" : "Free time exploration"
            ]
          })),
          estimatedCost: `$${Math.floor(parseInt(tripDetails.budget || "1000") * 1.1)} - $${Math.floor(parseInt(tripDetails.budget || "1000") * 1.3)}`
        },
        {
          id: 3,
          title: `Premium ${userPreference.types[2] || "Experience"} - ${tripDetails.destination}`,
          duration: tripDetails.duration,
          feasibilityScore: Math.floor(Math.random() * 8) + 90, // 90-98
          highlights: ["Premium accommodation", "Exclusive access", "Personal guide", "Luxury amenities"],
          itinerary: Array.from({ length: parseInt(tripDetails.duration) || 5 }, (_, i) => ({
            day: i + 1,
            activities: [
              i === 0 ? "VIP arrival" : `Private ${userPreference.activities[i % userPreference.activities.length]}`,
              i === 0 ? "Luxury check-in" : "Exclusive experience",
              i === parseInt(tripDetails.duration) - 1 ? "Premium departure" : "Fine dining"
            ]
          })),
          estimatedCost: `$${Math.floor(parseInt(tripDetails.budget || "1000") * 1.5)} - $${Math.floor(parseInt(tripDetails.budget || "1000") * 2)}`
        }
      ];
      
      setPlans(generatedPlans);
      setIsGenerating(false);
    }, 2000);
  };

  useEffect(() => {
    generatePlans();
  }, []);

  const handleNextPlan = () => {
    if (currentPlanIndex < plans.length - 1) {
      setCurrentPlanIndex(currentPlanIndex + 1);
    }
  };

  const handlePrevPlan = () => {
    if (currentPlanIndex > 0) {
      setCurrentPlanIndex(currentPlanIndex - 1);
    }
  };

  const handleSelectPlan = () => {
    const selectedPlan = plans[currentPlanIndex];
    // Navigate to booking flow with selected plan
    setLocation("/booking-flow?step=1");
    localStorage.setItem('selectedPlan', JSON.stringify({ tripDetails, selectedPlan }));
  };

  const handleRegeneratePlans = () => {
    setCurrentPlanIndex(0);
    generatePlans();
  };

  const getFeasibilityColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 75) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
          <h2 className="text-2xl font-bold text-gray-900">Generating Your Perfect Trip</h2>
          <p className="text-gray-600">AI is crafting personalized itineraries based on your preferences...</p>
          <Progress value={66} className="w-64 mx-auto" />
        </div>
      </div>
    );
  }

  const currentPlan = plans[currentPlanIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/")}
              className="mr-3"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">AI Generated Plans</h1>
          </div>
          <Badge variant="outline" className="text-sm">
            Plan {currentPlanIndex + 1} of {plans.length}
          </Badge>
        </div>

        {/* Trip Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {tripDetails.destination}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{tripDetails.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{tripDetails.travelers} travelers</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span className="text-sm">${tripDetails.budget}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-gray-500" />
                <span className="text-sm capitalize">{tripDetails.interest}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Plan */}
        {currentPlan && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{currentPlan.title}</CardTitle>
                  <p className="text-gray-600 mt-1">{currentPlan.duration} itinerary</p>
                </div>
                <div className="text-right">
                  <Badge className={`${getFeasibilityColor(currentPlan.feasibilityScore)} border-0`}>
                    {currentPlan.feasibilityScore}% Feasible
                  </Badge>
                  <p className="text-sm text-gray-500 mt-1">{currentPlan.estimatedCost}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Highlights */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Trip Highlights</h3>
                <div className="grid grid-cols-2 gap-2">
                  {currentPlan.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Itinerary */}
              <div>
                <h3 className="font-semibold mb-3">Day-by-Day Itinerary</h3>
                <div className="space-y-4">
                  {currentPlan.itinerary.map((day) => (
                    <div key={day.day} className="border-l-4 border-blue-200 pl-4">
                      <h4 className="font-medium text-blue-700">Day {day.day}</h4>
                      <ul className="mt-2 space-y-1">
                        {day.activities.map((activity, index) => (
                          <li key={index} className="text-sm text-gray-600">• {activity}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Controls */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevPlan}
            disabled={currentPlanIndex === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous Plan
          </Button>

          <div className="flex gap-3">
            {currentPlanIndex === plans.length - 1 ? (
              <Button
                variant="outline"
                onClick={handleRegeneratePlans}
                className="border-purple-500 text-purple-600 hover:bg-purple-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate Plans
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={handleNextPlan}
              >
                Next Plan
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}

            <Button 
              onClick={handleSelectPlan}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Select This Plan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanGeneration;