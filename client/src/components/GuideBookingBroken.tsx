import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { MapPin, Clock, Users, DollarSign, MessageCircle, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GuideMessaging } from "./GuideMessaging";
import { UserNotifications } from "./UserNotifications";

interface Guide {
  id: number;
  name: string;
  bio: string;
  hourlyRate: number;
  serviceAreas: string[];
  languages: string[];
  tourInterests: string[];
  rating?: number;
  totalReviews?: number;
}

interface GuideBookingRequest {
  guideId: number;
  destination: string;
  date: string;
  time: string;
  duration: string;
  travelers: number;
  budget: string;
  specialRequests?: string;
}

export function GuideBooking({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [showMessaging, setShowMessaging] = useState(false);
  const [activeBookingId, setActiveBookingId] = useState<number | null>(null);
  
  const [bookingData, setBookingData] = useState<Partial<GuideBookingRequest>>({
    destination: "",
    date: "",
    time: "",
    duration: "2-3 hours",
    travelers: 1,
    budget: "50-100",
    specialRequests: ""
  });

  // Fetch available guides
  const { data: guides = [], isLoading: guidesLoading } = useQuery({
    queryKey: ['/api/guides/available'],
    enabled: step === 2
  });

  // Fetch user's bookings
  const { data: userBookings = [] } = useQuery({
    queryKey: ['/api/guide-bookings/user'],
    enabled: !!user
  });

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: (data: GuideBookingRequest) => 
      apiRequest('POST', '/api/guide-bookings', data),
    onSuccess: (response) => {
      toast({
        title: "Booking Request Sent!",
        description: "Your guide will receive your request and respond soon."
      });
      queryClient.invalidateQueries({ queryKey: ['/api/guide-bookings/user'] });
      setStep(3); // Go to bookings view instead of messaging
    },
    onError: (error) => {
      console.error("Booking request error:", error);
      toast({
        title: "Error",
        description: "Failed to send booking request. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleBookingSubmit = () => {
    if (!selectedGuide || !user) return;

    // Validate required fields
    if (!bookingData.destination || !bookingData.date || !bookingData.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in destination, date, and time.",
        variant: "destructive"
      });
      return;
    }

    const request: GuideBookingRequest = {
      guideId: selectedGuide.id,
      destination: bookingData.destination,
      date: bookingData.date,
      time: bookingData.time,
      duration: bookingData.duration!,
      travelers: bookingData.travelers!,
      budget: bookingData.budget!,
      specialRequests: bookingData.specialRequests
    };

    console.log("Submitting booking request:", request);
    createBookingMutation.mutate(request);
  };

  // Early return for messaging
  if (showMessaging && activeBookingId) {
    return (
      <GuideMessaging 
        bookingId={activeBookingId}
        onBack={() => setShowMessaging(false)}
        onClose={onClose}
      />
    );
  }

  const renderStepOne = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Trip Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="destination">Destination</Label>
          <Input
            id="destination"
            value={bookingData.destination}
            onChange={(e) => setBookingData(prev => ({ ...prev, destination: e.target.value }))}
            placeholder="Where do you want to explore?"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={bookingData.date}
              onChange={(e) => setBookingData(prev => ({ ...prev, date: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <Label htmlFor="time">Time</Label>
            <Select value={bookingData.time} onValueChange={(value) => setBookingData(prev => ({ ...prev, time: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="09:00">9:00 AM</SelectItem>
                <SelectItem value="10:00">10:00 AM</SelectItem>
                <SelectItem value="11:00">11:00 AM</SelectItem>
                <SelectItem value="12:00">12:00 PM</SelectItem>
                <SelectItem value="13:00">1:00 PM</SelectItem>
                <SelectItem value="14:00">2:00 PM</SelectItem>
                <SelectItem value="15:00">3:00 PM</SelectItem>
                <SelectItem value="16:00">4:00 PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="duration">Duration</Label>
            <Select value={bookingData.duration} onValueChange={(value) => setBookingData(prev => ({ ...prev, duration: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-2 hours">1-2 hours</SelectItem>
                <SelectItem value="2-3 hours">2-3 hours</SelectItem>
                <SelectItem value="4-6 hours">4-6 hours</SelectItem>
                <SelectItem value="Full day">Full day</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="travelers">Travelers</Label>
            <Select value={bookingData.travelers?.toString()} onValueChange={(value) => setBookingData(prev => ({ ...prev, travelers: parseInt(value) }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1,2,3,4,5,6,7,8].map(num => (
                  <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="budget">Budget Range</Label>
          <Select value={bookingData.budget} onValueChange={(value) => setBookingData(prev => ({ ...prev, budget: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25-50">$25-50</SelectItem>
              <SelectItem value="50-100">$50-100</SelectItem>
              <SelectItem value="100-200">$100-200</SelectItem>
              <SelectItem value="200+">$200+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="requests">Special Requests (Optional)</Label>
          <Textarea
            id="requests"
            value={bookingData.specialRequests}
            onChange={(e) => setBookingData(prev => ({ ...prev, specialRequests: e.target.value }))}
            placeholder="Any specific preferences or needs?"
            rows={3}
          />
        </div>

        <Button 
          onClick={() => setStep(2)} 
          className="w-full"
          disabled={!bookingData.destination || !bookingData.date || !bookingData.time}
        >
          Find Local Guides
        </Button>
      </CardContent>
    </Card>
  );

  const renderStepTwo = () => (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="outline" onClick={() => setStep(1)} className="mb-4">
          ← Back to Details
        </Button>
        <h2 className="text-2xl font-bold">Available Local Guides</h2>
        <p className="text-muted-foreground">Choose your perfect local guide for {bookingData.destination}</p>
      </div>

      {guidesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {guides.map((guide: Guide) => (
            <Card 
              key={guide.id} 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedGuide?.id === guide.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedGuide(guide)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg">{guide.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{guide.rating || 4.8}</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{guide.bio}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4" />
                    <span>${guide.hourlyRate}/hour</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {guide.languages?.slice(0, 2).map(lang => (
                      <Badge key={lang} variant="secondary" className="text-xs">{lang}</Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {guide.tourInterests?.slice(0, 2).map(interest => (
                    <Badge key={interest} variant="outline" className="text-xs">{interest}</Badge>
                  ))}
                </div>

                {selectedGuide?.id === guide.id && (
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookingSubmit();
                    }} 
                    className="w-full"
                    disabled={createBookingMutation.isPending}
                  >
                    {createBookingMutation.isPending ? "Sending Request..." : "Send Booking Request"}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderUserBookings = () => (
    <div className="w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Your Guide Bookings</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications Panel */}
        <div className="lg:col-span-1">
          <UserNotifications 
            onNotificationClick={(notification) => {
              if (notification.type === 'booking_accepted' || notification.type === 'booking_declined') {
                // Refresh bookings when notification is clicked
                queryClient.invalidateQueries({ queryKey: ['/api/guide-bookings/user'] });
              }
            }}
          />
        </div>
        
        {/* Bookings List */}
        <div className="lg:col-span-2 space-y-4">
          {userBookings.map((booking: any) => (
            <Card key={booking.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{booking.destination}</h3>
                  <p className="text-sm text-muted-foreground">
                    {booking.date} at {booking.time} • {booking.duration}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">{booking.travelers} travelers</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-sm">${booking.budget}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    booking.status === 'pending' ? 'secondary' :
                    booking.status === 'accepted' ? 'default' :
                    booking.status === 'rejected' ? 'destructive' : 'outline'
                    }>
                      {booking.status}
                    </Badge>
                    <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setActiveBookingId(booking.id);
                      setShowMessaging(true);
                    }}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                </div>
              </div>
              </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // Main component render
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Local Guide Booking</h1>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>

          <div className="flex gap-4 mb-8">
            <Button 
              variant={step === 1 ? "default" : "outline"} 
              onClick={() => setStep(1)}
            >
              Trip Details
            </Button>
            <Button 
              variant={step === 2 ? "default" : "outline"} 
              onClick={() => setStep(2)}
              disabled={!bookingData.destination || !bookingData.date}
            >
              Find Guides
            </Button>
            <Button 
              variant={step === 3 ? "default" : "outline"} 
              onClick={() => setStep(3)}
            >
              My Bookings
            </Button>
          </div>

          {step === 1 && renderStepOne()}
          {step === 2 && renderStepTwo()}
          {step === 3 && renderUserBookings()}
        </div>
      </div>
    </div>
  );
}