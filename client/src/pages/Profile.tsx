import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Mail, Phone, MapPin, Heart, Plane, Edit, Calendar, Utensils, Globe } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";


const Profile = () => {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();

  const formatArray = (arr: string[] | null) => {
    if (!arr || arr.length === 0) return "Not specified";
    return arr.join(", ");
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          </div>
          <div className="flex items-center gap-3">

            <Button
              onClick={() => setLocation('/profile/edit')}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <div className="text-gray-500 text-lg">Loading profile...</div>
          </div>
        ) : !isAuthenticated || !user ? (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <div className="text-gray-500 text-lg mb-2">Please sign in to view your profile</div>
            <Button onClick={() => setLocation('/')} className="mt-4">
              Go to Sign In
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Profile Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.profileImageUrl || ""} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                      {user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold">{user.name}</h2>
                    <p className="text-gray-600">Travel Enthusiast</p>
                    <Badge variant="secondary" className="mt-1">
                      {user.role === 'guide' ? 'Local Guide' : 'Traveler'}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{user.phone || "Not provided"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{user.countryOfResidence || "Not specified"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{user.dateOfBirth || "Not provided"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Travel Preferences Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="h-5 h-5 text-blue-500" />
                  Travel Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Travel Style</h4>
                    <p className="text-gray-600">{user.travelStyle || "Not specified"}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Travel Frequency</h4>
                    <p className="text-gray-600">{user.travelFrequency || "Not specified"}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Passport Country</h4>
                    <p className="text-gray-600">{user.passportCountry || "Not provided"}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Emergency Contact</h4>
                    <p className="text-gray-600">{user.emergencyContact || "Not provided"}</p>
                  </div>
                </div>
                
                {/* Preferred Destinations */}
                <div className="mt-6">
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    Preferred Destinations
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {user.preferredDestinations && user.preferredDestinations.length > 0 ? (
                      user.preferredDestinations.map((destination: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {destination}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No preferred destinations specified</p>
                    )}
                  </div>
                </div>

                {/* Dietary Preferences */}
                <div className="mt-6">
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Utensils className="h-4 w-4 text-green-500" />
                    Dietary Preferences
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {user.dietaryPreferences && user.dietaryPreferences.length > 0 ? (
                      user.dietaryPreferences.map((preference: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {preference}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No dietary preferences specified</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 h-5 text-purple-500" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Member Since</h4>
                    <p className="text-gray-600">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Last Active</h4>
                    <p className="text-gray-600">
                      {user.lastActiveAt ? new Date(user.lastActiveAt).toLocaleDateString() : "Unknown"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;