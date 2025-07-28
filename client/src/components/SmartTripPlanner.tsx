
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  MapPin, 
  Calendar as CalendarIcon, 
  Users, 
  DollarSign, 
  Sparkles,
  ChevronRight
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SmartTripPlannerProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDestination?: string;
  defaultPlan?: any;
}

const interestOptions = [
  { id: 'adventure', label: 'Adventure Trip', icon: '🏔️' },
  { id: 'pilgrimage', label: 'Pilgrimage Trip', icon: '🕉️' },
  { id: 'relaxation', label: 'Relaxation Trip', icon: '🏖️' },
  { id: 'business', label: 'Business Trip', icon: '💼' }
];

// Popular travel destinations for search suggestions
const popularDestinations = [
  "Paris, France", "London, England", "Tokyo, Japan", "New York, USA", "Rome, Italy",
  "Barcelona, Spain", "Amsterdam, Netherlands", "Berlin, Germany", "Sydney, Australia",
  "Bangkok, Thailand", "Dubai, UAE", "Singapore", "Istanbul, Turkey", "Prague, Czech Republic",
  "Vienna, Austria", "Mumbai, India", "Cairo, Egypt", "Rio de Janeiro, Brazil", "Buenos Aires, Argentina",
  "Mexico City, Mexico", "Toronto, Canada", "Seoul, South Korea", "Hong Kong", "Zurich, Switzerland",
  "Stockholm, Sweden", "Copenhagen, Denmark", "Oslo, Norway", "Helsinki, Finland", "Reykjavik, Iceland",
  "Dublin, Ireland", "Edinburgh, Scotland", "Madrid, Spain", "Lisbon, Portugal", "Athens, Greece",
  "Budapest, Hungary", "Warsaw, Poland", "Moscow, Russia", "St. Petersburg, Russia", "Kiev, Ukraine",
  "Bucharest, Romania", "Sofia, Bulgaria", "Zagreb, Croatia", "Belgrade, Serbia", "Ljubljana, Slovenia",
  "Tallinn, Estonia", "Riga, Latvia", "Vilnius, Lithuania", "Minsk, Belarus", "Chisinau, Moldova",
  "Tirana, Albania", "Skopje, North Macedonia", "Podgorica, Montenegro", "Sarajevo, Bosnia and Herzegovina",
  "Pristina, Kosovo", "Bali, Indonesia", "Phuket, Thailand", "Goa, India", "Maldives", "Santorini, Greece",
  "Mykonos, Greece", "Ibiza, Spain", "Mallorca, Spain", "Canary Islands, Spain", "Madeira, Portugal",
  "Cyprus", "Malta", "Crete, Greece", "Sicily, Italy", "Sardinia, Italy", "Corsica, France",
  "Hawaiian Islands, USA", "Fiji", "Tahiti", "Seychelles", "Mauritius", "Madagascar", "Zanzibar, Tanzania",
  "Cape Town, South Africa", "Marrakech, Morocco", "Casablanca, Morocco", "Tunis, Tunisia", "Algiers, Algeria",
  "Lagos, Nigeria", "Nairobi, Kenya", "Addis Ababa, Ethiopia", "Khartoum, Sudan", "Kampala, Uganda",
  "Kigali, Rwanda", "Dar es Salaam, Tanzania", "Lusaka, Zambia", "Harare, Zimbabwe", "Gaborone, Botswana",
  "Windhoek, Namibia", "Maputo, Mozambique", "Antananarivo, Madagascar", "Port Louis, Mauritius",
  "Victoria, Seychelles", "Beijing, China", "Shanghai, China", "Guangzhou, China", "Shenzhen, China",
  "Chengdu, China", "Xi'an, China", "Hangzhou, China", "Nanjing, China", "Wuhan, China", "Tianjin, China",
  "Manila, Philippines", "Cebu, Philippines", "Davao, Philippines", "Jakarta, Indonesia", "Surabaya, Indonesia",
  "Bandung, Indonesia", "Medan, Indonesia", "Semarang, Indonesia", "Palembang, Indonesia", "Makassar, Indonesia",
  "Kuala Lumpur, Malaysia", "George Town, Malaysia", "Johor Bahru, Malaysia", "Ipoh, Malaysia", "Kota Kinabalu, Malaysia",
  "Brunei", "Phnom Penh, Cambodia", "Siem Reap, Cambodia", "Vientiane, Laos", "Yangon, Myanmar", "Naypyidaw, Myanmar",
  "Hanoi, Vietnam", "Ho Chi Minh City, Vietnam", "Da Nang, Vietnam", "Nha Trang, Vietnam", "Hoi An, Vietnam",
  "Colombo, Sri Lanka", "Kandy, Sri Lanka", "Galle, Sri Lanka", "Kathmandu, Nepal", "Pokhara, Nepal",
  "Thimphu, Bhutan", "Paro, Bhutan", "Male, Maldives", "Dhaka, Bangladesh", "Chittagong, Bangladesh",
  "Sylhet, Bangladesh", "Rajshahi, Bangladesh", "Khulna, Bangladesh", "Barisal, Bangladesh", "Rangpur, Bangladesh",
  "Islamabad, Pakistan", "Karachi, Pakistan", "Lahore, Pakistan", "Faisalabad, Pakistan", "Rawalpindi, Pakistan",
  "Multan, Pakistan", "Hyderabad, Pakistan", "Gujranwala, Pakistan", "Peshawar, Pakistan", "Quetta, Pakistan",
  "Kabul, Afghanistan", "Kandahar, Afghanistan", "Herat, Afghanistan", "Mazar-i-Sharif, Afghanistan", "Jalalabad, Afghanistan",
  "Tehran, Iran", "Mashhad, Iran", "Isfahan, Iran", "Karaj, Iran", "Shiraz, Iran", "Tabriz, Iran", "Qom, Iran",
  "Ahvaz, Iran", "Kermanshah, Iran", "Urmia, Iran", "Rasht, Iran", "Zahedan, Iran", "Hamedan, Iran", "Yazd, Iran",
  "Arak, Iran", "Ardabil, Iran", "Bandar Abbas, Iran", "Kerman, Iran", "Zanjan, Iran", "Sanandaj, Iran",
  "Khorramabad, Iran", "Gorgan, Iran", "Sari, Iran", "Dezful, Iran", "Kashan, Iran", "Ilam, Iran", "Bushehr, Iran",
  "Qazvin, Iran", "Semnan, Iran", "Yasuj, Iran", "Birjand, Iran", "Jiroft, Iran", "Bam, Iran", "Minab, Iran",
  "Sirjan, Iran", "Saveh, Iran", "Mahabad, Iran", "Marand, Iran", "Abhar, Iran", "Khoy, Iran", "Maragheh, Iran",
  "Miandoab, Iran", "Shabestar, Iran", "Salmas, Iran", "Naghadeh, Iran", "Piranshahr, Iran", "Sardasht, Iran",
  "Chaldoran, Iran", "Showt, Iran", "Poldasht, Iran", "Maku, Iran", "Khoda Afarin, Iran", "Julfa, Iran"
];

const SmartTripPlanner = ({ isOpen, onClose, defaultDestination, defaultPlan }: SmartTripPlannerProps) => {
  const [destination, setDestination] = useState(defaultDestination || '');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [travelers, setTravelers] = useState('');
  const [budget, setBudget] = useState('');
  const [selectedInterest, setSelectedInterest] = useState('');
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  const isFormComplete = destination && startDate && endDate && travelers && budget && selectedInterest;

  // Handle destination search suggestions
  const handleDestinationChange = (value: string) => {
    setDestination(value);
    
    if (value.length > 0) {
      const filteredSuggestions = popularDestinations
        .filter(dest => dest.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5); // Show max 5 suggestions
      setSuggestions(filteredSuggestions);
      setShowSuggestions(filteredSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setDestination(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGenerateAIPlan = () => {
    if (!isFormComplete) return;
    
    const tripDetails = {
      destination,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      travelers: parseInt(travelers),
      budget,
      interest: selectedInterest,
      duration: startDate && endDate ? 
        `${Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days` : ''
    };
    
    console.log('Generating plan with details:', tripDetails);
    
    // Store trip details and navigate to plan generation
    localStorage.setItem('currentTripDetails', JSON.stringify(tripDetails));
    
    // Close modal and navigate
    onClose();
    
    // Navigate to plan generation page
    setTimeout(() => {
      window.location.href = '/plan-generation';
    }, 100);
  };

  const resetForm = () => {
    setDestination(defaultDestination || '');
    setStartDate(undefined);
    setEndDate(undefined);
    setTravelers('');
    setBudget('');
    setSelectedInterest('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span>Smart Trip Planner</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">Plan your perfect trip</h3>
            <p className="text-gray-600">Fill in the details below to generate your AI-powered itinerary</p>
          </div>

          {/* Destination */}
          <div className="space-y-2">
            <Label htmlFor="destination" className="text-sm font-medium">Destination *</Label>
            <div className="relative" ref={suggestionRef}>
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
              <Input
                id="destination"
                placeholder="Where do you want to go?"
                className="pl-10"
                value={destination}
                onChange={(e) => handleDestinationChange(e.target.value)}
                onFocus={() => {
                  if (destination.length > 0 && suggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
              />
              
              {/* Search Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto z-50">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center gap-2"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{suggestion}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Date Range *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-gray-600">Starting Date</Label>
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
                <Label className="text-xs text-gray-600">Ending Date</Label>
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
          </div>

          {/* Number of Travelers */}
          <div className="space-y-2">
            <Label htmlFor="travelers" className="text-sm font-medium">Number of Travelers *</Label>
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
            <Label htmlFor="budget" className="text-sm font-medium">Budget Range *</Label>
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
            <Label className="text-sm font-medium">Interests and Preferences *</Label>
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
              <p className="text-sm text-amber-700 font-medium mb-2">
                Please fill in all required details to generate your AI trip plan:
              </p>
              <ul className="text-xs text-amber-600 space-y-1">
                {!destination && <li>• Enter destination</li>}
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
              onClick={handleGenerateAIPlan}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3"
              size="lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate AI Plan
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SmartTripPlanner;
