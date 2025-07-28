import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, MapPin, Globe, Camera, User, Phone, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GuideRegistrationProps {
  onRegistrationComplete: (guide: any) => void;
  onBack?: () => void;
}

const serviceAreas = [
  "Tokyo, Japan", "Paris, France", "London, England", "New York, USA", "Rome, Italy",
  "Barcelona, Spain", "Amsterdam, Netherlands", "Berlin, Germany", "Sydney, Australia",
  "Bangkok, Thailand", "Dubai, UAE", "Singapore", "Istanbul, Turkey", "Prague, Czech Republic",
  "Vienna, Austria", "Mumbai, India", "Cairo, Egypt", "Rio de Janeiro, Brazil", "Buenos Aires, Argentina",
  "Mexico City, Mexico", "Toronto, Canada", "Seoul, South Korea", "Hong Kong", "Zurich, Switzerland"
];

const languages = [
  "English", "Spanish", "French", "German", "Italian", "Portuguese", "Japanese", "Korean",
  "Mandarin Chinese", "Arabic", "Hindi", "Russian", "Dutch", "Swedish", "Norwegian",
  "Danish", "Finnish", "Greek", "Turkish", "Polish", "Czech", "Hungarian", "Romanian"
];

const tourInterests = [
  "Historical Sites", "Art & Museums", "Food Tours", "Adventure Activities", "Cultural Experiences",
  "Photography Tours", "Nature & Wildlife", "Architecture", "Shopping", "Nightlife",
  "Religious Sites", "Local Markets", "Street Art", "Music & Entertainment", "Sports Events",
  "Beaches & Coastal", "Mountain Adventures", "City Walking Tours", "Bike Tours", "Boat Trips"
];

const GuideRegistration = ({ onRegistrationComplete, onBack }: GuideRegistrationProps) => {
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState("");
  const [certification, setCertification] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [areaSearch, setAreaSearch] = useState("");
  const [languageSearch, setLanguageSearch] = useState("");
  const [interestSearch, setInterestSearch] = useState("");
  const { toast } = useToast();

  // Get current user from localStorage
  const getCurrentUser = () => {
    const currentUser = localStorage.getItem("travelApp_currentUser");
    return currentUser ? JSON.parse(currentUser) : null;
  };

  const handleAreaSelect = (area: string) => {
    if (!selectedAreas.includes(area)) {
      setSelectedAreas([...selectedAreas, area]);
    }
    setAreaSearch("");
  };

  const handleLanguageSelect = (language: string) => {
    if (!selectedLanguages.includes(language)) {
      setSelectedLanguages([...selectedLanguages, language]);
    }
    setLanguageSearch("");
  };

  const handleInterestSelect = (interest: string) => {
    if (!selectedInterests.includes(interest)) {
      setSelectedInterests([...selectedInterests, interest]);
    }
    setInterestSearch("");
  };

  const removeArea = (area: string) => {
    setSelectedAreas(selectedAreas.filter(a => a !== area));
  };

  const removeLanguage = (language: string) => {
    setSelectedLanguages(selectedLanguages.filter(l => l !== language));
  };

  const removeInterest = (interest: string) => {
    setSelectedInterests(selectedInterests.filter(i => i !== interest));
  };

  const handleSubmit = async () => {
    if (!bio || !phone || !experience || selectedAreas.length === 0 || selectedLanguages.length === 0 || selectedInterests.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and select at least one option for each category",
        variant: "destructive",
      });
      return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser) {
      toast({
        title: "Error",
        description: "User session not found. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem("travelApp_token");
      if (!token) {
        toast({
          title: "Error",
          description: "Session expired. Please log in again.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("/api/auth/complete-guide-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          bio,
          phone,
          experience,
          certification: certification || "Not specified",
          hourlyRate: parseFloat(hourlyRate) || 50,
          serviceAreas: selectedAreas,
          languages: selectedLanguages,
          tourInterests: selectedInterests,
          profileImageUrl: "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Error",
          description: data.error || "Failed to complete profile",
          variant: "destructive",
        });
        return;
      }

      // Update local storage with complete user data
      localStorage.setItem("travelApp_currentUser", JSON.stringify(data.user));

      toast({
        title: "Success",
        description: "Guide profile completed successfully!",
      });

      onRegistrationComplete(data.user);
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredAreas = serviceAreas.filter(area => 
    area.toLowerCase().includes(areaSearch.toLowerCase()) && !selectedAreas.includes(area)
  );

  const filteredLanguages = languages.filter(language => 
    language.toLowerCase().includes(languageSearch.toLowerCase()) && !selectedLanguages.includes(language)
  );

  const filteredInterests = tourInterests.filter(interest => 
    interest.toLowerCase().includes(interestSearch.toLowerCase()) && !selectedInterests.includes(interest)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Complete Your Local Guide Profile
            </CardTitle>
            <p className="text-gray-600 mt-2">Help travelers discover your expertise and services</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    placeholder="Your contact number"
                    className="pl-10"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly Rate (USD)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">$</span>
                  <Input
                    id="hourlyRate"
                    type="number"
                    placeholder="25"
                    className="pl-8"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio *</Label>
              <Textarea
                id="bio"
                placeholder="Tell travelers about yourself, your passion for guiding, and what makes your tours special..."
                className="min-h-20"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            {/* Experience & Certification */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience *</Label>
                <div className="relative">
                  <Award className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="experience"
                    placeholder="e.g., 5 years"
                    className="pl-10"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="certification">Certifications (Optional)</Label>
                <Input
                  id="certification"
                  placeholder="e.g., Licensed Tour Guide, First Aid Certified"
                  value={certification}
                  onChange={(e) => setCertification(e.target.value)}
                />
              </div>
            </div>

            {/* Service Areas */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Service Areas * (Cities/Regions you guide in)
              </Label>
              <div className="relative">
                <Input
                  placeholder="Search and select cities..."
                  value={areaSearch}
                  onChange={(e) => setAreaSearch(e.target.value)}
                />
                {areaSearch && filteredAreas.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto z-50">
                    {filteredAreas.slice(0, 8).map((area) => (
                      <div
                        key={area}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => handleAreaSelect(area)}
                      >
                        {area}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedAreas.map((area) => (
                  <Badge key={area} variant="secondary" className="flex items-center gap-1">
                    {area}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeArea(area)} />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Languages Spoken *
              </Label>
              <div className="relative">
                <Input
                  placeholder="Search and select languages..."
                  value={languageSearch}
                  onChange={(e) => setLanguageSearch(e.target.value)}
                />
                {languageSearch && filteredLanguages.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto z-50">
                    {filteredLanguages.slice(0, 8).map((language) => (
                      <div
                        key={language}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => handleLanguageSelect(language)}
                      >
                        {language}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedLanguages.map((language) => (
                  <Badge key={language} variant="secondary" className="flex items-center gap-1">
                    {language}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeLanguage(language)} />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tour Interests */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Tour Specializations *
              </Label>
              <div className="relative">
                <Input
                  placeholder="Search and select tour types..."
                  value={interestSearch}
                  onChange={(e) => setInterestSearch(e.target.value)}
                />
                {interestSearch && filteredInterests.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto z-50">
                    {filteredInterests.slice(0, 8).map((interest) => (
                      <div
                        key={interest}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => handleInterestSelect(interest)}
                      >
                        {interest}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedInterests.map((interest) => (
                  <Badge key={interest} variant="secondary" className="flex items-center gap-1">
                    {interest}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeInterest(interest)} />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              {onBack && (
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="flex-1 py-3"
                  size="lg"
                >
                  Back
                </Button>
              )}
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-3"
                size="lg"
              >
                Complete Registration & Start Guiding
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GuideRegistration;