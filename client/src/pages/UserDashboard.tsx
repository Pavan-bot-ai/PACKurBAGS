import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Heart, 
  History,
  Settings,
  LogOut,
  Plane,
  Hotel,
  Star,
  Clock
} from "lucide-react";

interface UserDashboardProps {
  user: any;
  onLogout: () => void;
}

const UserDashboard = ({ user, onLogout }: UserDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for user dashboard
  const recentTrips = [
    {
      id: 1,
      destination: "Paris, France",
      dates: "Dec 15-22, 2024",
      status: "Completed",
      totalCost: "$2,450",
      rating: 5
    },
    {
      id: 2,
      destination: "Tokyo, Japan",
      dates: "Nov 8-15, 2024",
      status: "Completed",
      totalCost: "$3,200",
      rating: 4
    }
  ];

  const upcomingTrips = [
    {
      id: 3,
      destination: "Bali, Indonesia",
      dates: "Feb 10-17, 2025",
      status: "Confirmed",
      totalCost: "$1,800"
    }
  ];

  const savedPlaces = [
    {
      id: 1,
      name: "Santorini, Greece",
      type: "Island Paradise",
      image: "🏝️"
    },
    {
      id: 2,
      name: "Machu Picchu, Peru",
      type: "Historical Site",
      image: "🏔️"
    },
    {
      id: 3,
      name: "Dubai, UAE",
      type: "Modern City",
      image: "🏙️"
    }
  ];

  const stats = [
    {
      title: "Trips Completed",
      value: recentTrips.length.toString(),
      icon: Plane,
      color: "text-blue-600"
    },
    {
      title: "Countries Visited",
      value: "8",
      icon: MapPin,
      color: "text-green-600"
    },
    {
      title: "Total Spent",
      value: "$12,450",
      icon: DollarSign,
      color: "text-purple-600"
    },
    {
      title: "Saved Places",
      value: savedPlaces.length.toString(),
      icon: Heart,
      color: "text-red-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Travel Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                Traveler
              </Badge>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trips">My Trips</TabsTrigger>
            <TabsTrigger value="saved">Saved Places</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Plane className="h-4 w-4 mr-2" />
                    Plan New Trip
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Hotel className="h-4 w-4 mr-2" />
                    Find Hotels
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <MapPin className="h-4 w-4 mr-2" />
                    Discover Places
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <History className="h-4 w-4 mr-2" />
                    View Trip History
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Trip</CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingTrips.length > 0 ? (
                    <div className="space-y-3">
                      {upcomingTrips.map((trip) => (
                        <div key={trip.id} className="p-4 bg-blue-50 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{trip.destination}</h4>
                              <p className="text-sm text-gray-600">{trip.dates}</p>
                              <Badge variant="secondary" className="mt-1">
                                {trip.status}
                              </Badge>
                            </div>
                            <p className="font-semibold text-blue-600">{trip.totalCost}</p>
                          </div>
                          <Button size="sm" className="mt-3">
                            View Details
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No upcoming trips</p>
                      <Button size="sm" className="mt-2">
                        Plan Your Next Adventure
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Trips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTrips.map((trip) => (
                    <div key={trip.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                          {trip.destination.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold">{trip.destination}</h4>
                          <p className="text-sm text-gray-600">{trip.dates}</p>
                          <div className="flex items-center mt-1">
                            {Array.from({ length: trip.rating }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{trip.totalCost}</p>
                        <Badge variant="secondary">{trip.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trips Tab */}
          <TabsContent value="trips" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Trips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentTrips.map((trip) => (
                    <div key={trip.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{trip.destination}</h4>
                        <Badge variant="secondary">{trip.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{trip.dates}</p>
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{trip.totalCost}</p>
                        <div className="flex items-center">
                          {Array.from({ length: trip.rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Trips</CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingTrips.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingTrips.map((trip) => (
                        <div key={trip.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{trip.destination}</h4>
                            <Badge>{trip.status}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{trip.dates}</p>
                          <p className="font-semibold">{trip.totalCost}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No upcoming trips</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Saved Places Tab */}
          <TabsContent value="saved" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Saved Places</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedPlaces.map((place) => (
                    <div key={place.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="text-center">
                        <div className="text-4xl mb-2">{place.image}</div>
                        <h4 className="font-semibold">{place.name}</h4>
                        <p className="text-sm text-gray-600">{place.type}</p>
                        <Button size="sm" className="mt-3" variant="outline">
                          Plan Trip
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-center py-8">
                  Your flight, hotel, and activity bookings will appear here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Personal Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500">Name:</span> {user.name}</p>
                      <p><span className="text-gray-500">Email:</span> {user.email}</p>
                      <p><span className="text-gray-500">Member Since:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Travel Preferences</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500">Preferred Language:</span> English</p>
                      <p><span className="text-gray-500">Travel Style:</span> Explorer</p>
                      <p><span className="text-gray-500">Budget Range:</span> $2000-5000</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Travel Statistics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                      <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                        <stat.icon className={`h-6 w-6 ${stat.color} mx-auto mb-2`} />
                        <p className="text-lg font-bold">{stat.value}</p>
                        <p className="text-xs text-gray-600">{stat.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;