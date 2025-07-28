import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileCompletionSchema, type ProfileCompletion } from "@shared/schema";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { User, MapPin, Heart, Plane, Phone, Save, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const TRAVEL_STYLES = [
  "Adventure", "Relaxation", "Cultural", "Luxury", "Budget", 
  "Family-friendly", "Solo", "Romantic", "Business", "Eco-tourism"
];

const TRAVEL_FREQUENCIES = [
  "Rarely (Once a year or less)", 
  "Occasionally (2-3 times a year)", 
  "Frequently (4-6 times a year)", 
  "Very Frequently (More than 6 times a year)"
];

const DIETARY_PREFERENCES = [
  "No restrictions", "Vegetarian", "Vegan", "Gluten-free", 
  "Halal", "Kosher", "Dairy-free", "Nut allergies", "Other"
];

const POPULAR_DESTINATIONS = [
  "Paris, France", "Tokyo, Japan", "New York, USA", "London, UK", 
  "Rome, Italy", "Barcelona, Spain", "Amsterdam, Netherlands", 
  "Bangkok, Thailand", "Sydney, Australia", "Dubai, UAE",
  "Bali, Indonesia", "Santorini, Greece", "Iceland", "Morocco",
  "Costa Rica", "Peru", "Vietnam", "Portugal", "Croatia", "Turkey"
];

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const ProfileCompletionModal = ({ isOpen, onClose, onComplete }: ProfileCompletionModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<ProfileCompletion>({
    resolver: zodResolver(profileCompletionSchema),
    defaultValues: {
      phone: user?.phone || "",
      dateOfBirth: user?.dateOfBirth || "",
      countryOfResidence: user?.countryOfResidence || "",
      preferredDestinations: user?.preferredDestinations || [],
      travelStyle: user?.travelStyle || "",
      travelFrequency: user?.travelFrequency || "",
      passportCountry: user?.passportCountry || "",
      emergencyContact: user?.emergencyContact || "",
      dietaryPreferences: user?.dietaryPreferences || [],
    },
  });

  const onSubmit = async (data: ProfileCompletion) => {
    setIsSubmitting(true);
    try {
      await apiRequest('POST', '/api/auth/complete-profile', data);
      
      // Mark that the prompt has been shown
      await apiRequest('POST', '/api/auth/mark-prompt-shown', {});
      
      await refreshUser();
      
      toast({
        title: "Profile Completed!",
        description: "Your travel preferences have been saved successfully.",
      });
      
      onComplete();
    } catch (error) {
      console.error('Error completing profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMaybeLater = async () => {
    try {
      const token = localStorage.getItem('travelApp_token');
      await fetch('/api/auth/mark-prompt-shown', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });
      await refreshUser();
      onClose();
    } catch (error) {
      console.error('Error marking prompt as shown:', error);
      onClose(); // Close anyway
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <DialogTitle className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</DialogTitle>
              <DialogDescription className="text-lg text-gray-600">
                Help us personalize your travel experience with your preferences
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Card className="shadow-xl">
          <CardHeader className="text-center border-b">
            <CardTitle className="text-2xl text-gray-900">Personal & Travel Information</CardTitle>
            <CardDescription className="text-base text-gray-600">
              Complete your profile to get personalized travel recommendations
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Phone className="w-5 h-5 text-blue-500" />
                Contact Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="emergencyContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Contact</FormLabel>
                    <FormControl>
                      <Input placeholder="Name and phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-500" />
                Location Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="countryOfResidence"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country of Residence</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., United States" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="passportCountry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passport Country</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., United States" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Travel Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Plane className="w-5 h-5 text-purple-500" />
                Travel Preferences
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="travelStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Travel Style</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your style" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TRAVEL_STYLES.map((style) => (
                            <SelectItem key={style} value={style}>{style}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="travelFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Travel Frequency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="How often do you travel?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TRAVEL_FREQUENCIES.map((frequency) => (
                            <SelectItem key={frequency} value={frequency}>{frequency}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Preferred Destinations */}
              <FormField
                control={form.control}
                name="preferredDestinations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      Preferred Destinations (Select multiple)
                    </FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto p-2 border rounded-md">
                      {POPULAR_DESTINATIONS.map((destination) => (
                        <div key={destination} className="flex items-center space-x-2">
                          <Checkbox
                            id={destination}
                            checked={field.value?.includes(destination)}
                            onCheckedChange={(checked) => {
                              const currentValues = field.value || [];
                              if (checked) {
                                field.onChange([...currentValues, destination]);
                              } else {
                                field.onChange(currentValues.filter(v => v !== destination));
                              }
                            }}
                          />
                          <label 
                            htmlFor={destination} 
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {destination}
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dietary Preferences */}
              <FormField
                control={form.control}
                name="dietaryPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dietary Preferences</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {DIETARY_PREFERENCES.map((preference) => (
                        <div key={preference} className="flex items-center space-x-2">
                          <Checkbox
                            id={preference}
                            checked={field.value?.includes(preference)}
                            onCheckedChange={(checked) => {
                              const currentValues = field.value || [];
                              if (checked) {
                                field.onChange([...currentValues, preference]);
                              } else {
                                field.onChange(currentValues.filter(v => v !== preference));
                              }
                            }}
                          />
                          <label 
                            htmlFor={preference} 
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {preference}
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleMaybeLater}
                disabled={isSubmitting}
                className="px-8 py-3 text-gray-600 hover:text-gray-800"
              >
                Maybe Later
              </Button>
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 px-8 py-3"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Saving..." : "Complete Profile"}
              </Button>
            </div>
          </form>
        </Form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};