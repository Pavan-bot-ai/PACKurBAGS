
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  MapPin, 
  Calendar as CalendarIcon, 
  Users, 
  DollarSign, 
  Sparkles,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  CheckCircle
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface PlaceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: string;
  onGeneratePlan: (details: any) => void;
}

const interestOptions = [
  { id: 'adventure', label: 'Adventure Trip', icon: '🏔️' },
  { id: 'pilgrimage', label: 'Pilgrimage Trip', icon: '🕉️' },
  { id: 'relaxation', label: 'Relaxation Trip', icon: '🏖️' },
  { id: 'business', label: 'Business Trip', icon: '💼' }
];

const samplePlans = [
  {
    id: 1,
    title: "Cultural Heritage Tour",
    duration: "5 days",
    feasibilityScore: 95,
    highlights: ["Ancient temples", "Local markets", "Traditional cuisine", "Art galleries"],
    itinerary: [
      { day: 1, activities: ["Arrive and check-in", "Local orientation walk", "Welcome dinner"] },
      { day: 2, activities: ["Temple complex visit", "Traditional craft workshop", "Street food tour"] },
      { day: 3, activities: ["Art gallery tours", "Local market exploration", "Cooking class"] },
      { day: 4, activities: ["Historical site visit", "Cultural performance", "Rooftop dining"] },
      { day: 5, activities: ["Souvenir shopping", "Final exploration", "Departure"] }
    ],
    estimatedCost: "$1,200 - $1,500"
  },
  {
    id: 2,
    title: "Adventure Explorer Package",
    duration: "7 days",
    feasibilityScore: 88,
    highlights: ["Hiking trails", "Water sports", "Mountain views", "Local wildlife"],
    itinerary: [
      { day: 1, activities: ["Arrival and gear check", "Base camp setup", "Evening briefing"] },
      { day: 2, activities: ["Mountain hiking", "Scenic viewpoints", "Outdoor camping"] },
      { day: 3, activities: ["Water sports activities", "Beach exploration", "Sunset watching"] },
      { day: 4, activities: ["Wildlife sanctuary visit", "Nature photography", "Local guide stories"] },
      { day: 5, activities: ["Rock climbing", "Adventure sports", "Team building"] },
      { day: 6, activities: ["Cultural village visit", "Traditional games", "Farewell party"] },
      { day: 7, activities: ["Pack up", "Final activities", "Departure"] }
    ],
    estimatedCost: "$1,800 - $2,200"
  }
];

const PlaceDetailsModal = ({ isOpen, onClose, destination, onGeneratePlan }: PlaceDetailsModalProps) => {
  const [view, setView] = useState<'form' | 'plans'>('form');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [travelers, setTravelers] = useState('');
  const [budget, setBudget] = useState('');
  const [selectedInterest, setSelectedInterest] = useState('');
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(0);

  const isFormComplete = startDate && endDate && travelers && budget && selectedInterest;

  const handleGeneratePlan = () => {
    if (!isFormComplete) return;

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setView('plans');
    }, 2000);
  };

  const handleSelectPlan = () => {
    const tripDetails = {
      destination,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      travelers: parseInt(travelers),
      budget,
      interest: selectedInterest,
      duration: `${Math.ceil((endDate!.getTime() - startDate!.getTime()) / (1000 * 60 * 60 * 24))} days`
    };

    const planDetails = {
      tripDetails,
      selectedPlan: samplePlans[currentPlan]
    };

    // Store selected plan and navigate directly to booking flow
    localStorage.setItem('selectedPlan', JSON.stringify(planDetails));
    
    // Close modal and navigate to booking flow
    onClose();
    
    // Navigate to booking flow
    setTimeout(() => {
      window.location.href = '/booking-flow?step=1';
    }, 100);
  };

  const resetForm = () => {
    setView('form');
    setStartDate(undefined);
    setEndDate(undefined);
    setTravelers('');
    setBudget('');
    setSelectedInterest('');
    setCurrentPlan(0);
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const currentPlanData = samplePlans[currentPlan];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span>{view === 'form' ? 'Plan Your Trip' : 'Your AI-Generated Plans'}</span>
          </DialogTitle>
        </DialogHeader>

        {view === 'form' && !isGenerating && (
          <div className="space-y-6">
            {/* Destination - Read Only */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Destination</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  value={destination}
                  disabled
                  className="pl-10 bg-gray-50 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Date Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Starting Date</Label>
                <Popover open={showStartCalendar} onOpenChange={setShowStartCalendar}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Select start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        setStartDate(date);
                        setShowStartCalendar(false);
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Ending Date</Label>
                <Popover open={showEndCalendar} onOpenChange={setShowEndCalendar}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Select end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => {
                        setEndDate(date);
                        setShowEndCalendar(false);
                      }}
                      disabled={(date) => !startDate || date <= startDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Number of Travelers */}
            <div className="space-y-2">
              <Label htmlFor="travelers" className="text-sm font-medium">Number of Travelers</Label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="travelers"
                  type="number"
                  min="1"
                  placeholder="How many people?"
                  className="pl-10"
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                />
              </div>
            </div>

            {/* Budget Range */}
            <div className="space-y-2">
              <Label htmlFor="budget" className="text-sm font-medium">Budget Range</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="budget"
                  placeholder="e.g., $1000 - $2000"
                  className="pl-10"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>
            </div>

            {/* Interests and Preferences */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Interests and Preferences</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {interestOptions.map((option) => (
                  <Card 
                    key={option.id}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md",
                      selectedInterest === option.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
                    )}
                    onClick={() => setSelectedInterest(option.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{option.icon}</span>
                          <span className="font-medium">{option.label}</span>
                        </div>
                        {selectedInterest === option.id && (
                          <ChevronRight className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Form Validation Message */}
            {!isFormComplete && (
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-700">
                  Please fill in all details to generate your AI trip plan:
                </p>
                <ul className="mt-2 text-xs text-amber-600 space-y-1">
                  {!startDate && <li>• Select starting date</li>}
                  {!endDate && <li>• Select ending date</li>}
                  {!travelers && <li>• Enter number of travelers</li>}
                  {!budget && <li>• Enter budget range</li>}
                  {!selectedInterest && <li>• Choose trip type</li>}
                </ul>
              </div>
            )}

            {/* Generate AI Plan Button */}
            {isFormComplete && (
              <Button 
                onClick={handleGeneratePlan}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3"
                size="lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Generate AI Plan
              </Button>
            )}
          </div>
        )}

        {view === 'plans' && !isGenerating && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Badge variant="secondary">
                Plan {currentPlan + 1} of {samplePlans.length}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setView('form')}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Form
              </Button>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">{currentPlanData.title}</CardTitle>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Feasibility Score</div>
                    <div className="flex items-center space-x-2">
                      <Progress value={currentPlanData.feasibilityScore} className="w-20" />
                      <span className="font-bold text-lg">{currentPlanData.feasibilityScore}/100</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{currentPlanData.duration}</span>
                  <span>•</span>
                  <span>{currentPlanData.estimatedCost}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Highlights</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentPlanData.highlights.map((highlight, index) => (
                        <Badge key={index} variant="outline">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Smart Itinerary</h4>
                    <div className="space-y-3">
                      {currentPlanData.itinerary.map((dayPlan) => (
                        <div key={dayPlan.day} className="border rounded-lg p-4">
                          <h5 className="font-medium mb-2">Day {dayPlan.day}</h5>
                          <ul className="space-y-1">
                            {dayPlan.activities.map((activity, index) => (
                              <li key={index} className="flex items-center space-x-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>{activity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPlan(currentPlan > 0 ? currentPlan - 1 : 0)}
                  disabled={currentPlan === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous Plan
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPlan(currentPlan < samplePlans.length - 1 ? currentPlan + 1 : 0)}
                >
                  {currentPlan < samplePlans.length - 1 ? 'Next Plan' : 'Regenerate'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <Button 
                onClick={handleSelectPlan}
                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Select This Plan
              </Button>
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="text-center py-12">
            <RefreshCw className="w-12 h-12 mx-auto mb-4 animate-spin text-purple-500" />
            <h3 className="text-xl font-semibold mb-2">Creating Your Perfect Trip</h3>
            <p className="text-gray-600">AI is analyzing thousands of possibilities...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PlaceDetailsModal;
