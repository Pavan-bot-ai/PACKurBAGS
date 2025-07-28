import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Star, 
  DollarSign, 
  Calendar, 
  Users, 
  Sparkles,
  Bell,
  TrendingUp,
  Award,
  Globe,
  Camera,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  Home,
  CreditCard,
  User,
  Clock,
  Phone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface GuideDashboardProps {
  user: any;
  onLogout: () => void;
}

const GuideDashboard = ({ user, onLogout }: GuideDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentView, setCurrentView] = useState("home"); // home, transactions, profile
  const [earnings, setEarnings] = useState({ total: 0, thisMonth: 0, thisWeek: 0 });
  const [tourIdeas, setTourIdeas] = useState([]);
  const [ideaPrompt, setIdeaPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [liveStats, setLiveStats] = useState({
    activeBookings: 0,
    todayEarnings: 0,
    responseTime: "2 mins",
    nextTour: null
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch guide booking requests
  const { data: guideBookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ['/api/guide-bookings/guide'],
    enabled: !!user
  });

  useEffect(() => {
    // Simulate loading guide data
    loadGuideData();
    loadTransactions();
    loadLiveStats();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      updateLiveStats();
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const loadGuideData = () => {
    // Simulate earnings data with more realistic numbers  
    setEarnings({
      total: parseFloat(user.totalEarnings) || 3250,
      thisMonth: 890,
      thisWeek: 275
    });
  };

  const loadTransactions = () => {
    setTransactions([
      {
        id: "TXN001",
        date: "2025-01-12",
        client: "Sarah Johnson",
        service: "Historic Paris Tour",
        amount: 150,
        status: "completed",
        paymentMethod: "Credit Card"
      },
      {
        id: "TXN002", 
        date: "2025-01-11",
        client: "David Kim",
        service: "Seine River Walk",
        amount: 85,
        status: "completed",
        paymentMethod: "Digital Wallet"
      },
      {
        id: "TXN003",
        date: "2025-01-10",
        client: "Lisa Zhang",
        service: "Louvre Private Tour",
        amount: 220,
        status: "pending",
        paymentMethod: "Bank Transfer"
      },
      {
        id: "TXN004",
        date: "2025-01-09",
        client: "Mark Wilson",
        service: "Culinary Experience",
        amount: 180,
        status: "completed",
        paymentMethod: "Credit Card"
      }
    ]);
  };

  const loadLiveStats = () => {
    setLiveStats({
      activeBookings: 7,
      todayEarnings: 275,
      responseTime: "2 mins",
      nextTour: {
        client: "Sarah Johnson",
        time: "2:00 PM",
        location: "Montmartre"
      }
    });
  };

  const updateLiveStats = () => {
    // Simulate real-time updates
    setLiveStats(prev => ({
      ...prev,
      activeBookings: prev.activeBookings + Math.floor(Math.random() * 3) - 1,
      todayEarnings: prev.todayEarnings + Math.floor(Math.random() * 20),
      responseTime: Math.floor(Math.random() * 5) + 1 + " mins"
    }));
  };

  const handleRequestAction = async (requestId: number, action: string) => {
    try {
      // Update booking status via API
      await apiRequest('PATCH', `/api/guide-bookings/${requestId}`, { status: action });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/guide-bookings/guide'] });
      
      toast({
        title: "Success",
        description: `Tour request ${action}ed successfully!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update request status.",
        variant: "destructive"
      });
    }
  };

  const generateTourIdea = async () => {
    if (!ideaPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a destination or theme for tour ideas",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const newIdea = {
        id: Date.now(),
        title: `${ideaPrompt} Discovery Tour`,
        description: `An immersive experience exploring the best of ${ideaPrompt}, including hidden gems, local culture, and must-see attractions.`,
        duration: "3-4 hours",
        highlights: [
          "Expert local insights",
          "Hidden local spots",
          "Cultural experiences",
          "Photography opportunities"
        ],
        suggestedPrice: "$85-120",
        difficulty: "Easy to Moderate"
      };
      
      setTourIdeas(prev => [newIdea, ...prev]);
      setIdeaPrompt("");
      setIsGenerating(false);
      
      toast({
        title: "AI Tour Idea Generated!",
        description: "Your personalized tour concept is ready for review.",
      });
    }, 2000);
  };

  const stats = [
    {
      title: "Total Earnings",
      value: `$${earnings.total}`,
      icon: DollarSign,
      change: "+12%",
      period: "from last month"
    },
    {
      title: "Active Tours",
      value: user.completedTours || "8",
      icon: MapPin,
      change: "+3",
      period: "this month"
    },
    {
      title: "Rating",
      value: user.rating || "4.9",
      icon: Star,
      change: "+0.2",
      period: "from reviews"
    },
    {
      title: "New Requests",
      value: guideBookings.filter(b => b.status === 'pending').length.toString(),
      icon: Bell,
      change: "",
      period: "awaiting response"
    }
  ];

  // Render different views based on currentView state
  const renderContent = () => {
    switch (currentView) {
      case "transactions":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Transaction History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{transaction.service}</h4>
                        <p className="text-sm text-gray-600">{transaction.client}</p>
                        <p className="text-xs text-gray-500">{transaction.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">${transaction.amount}</p>
                        <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                          {transaction.status}
                        </Badge>
                        <p className="text-xs text-gray-500">{transaction.paymentMethod}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      case "profile":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Guide Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <p className="text-lg font-medium">{user.name}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p>{user.email}</p>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <p>{user.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <Label>Experience</Label>
                    <p>{user.experience || "Not specified"}</p>
                  </div>
                  <div>
                    <Label>Hourly Rate</Label>
                    <p>${user.hourlyRate || "50"}/hour</p>
                  </div>
                  <div>
                    <Label>Rating</Label>
                    <p className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      {user.rating || "4.9"} ({user.totalReviews || "23"} reviews)
                    </p>
                  </div>
                </div>
                <div>
                  <Label>Bio</Label>
                  <p className="text-gray-700">{user.bio || "Professional local guide with passion for sharing culture and history."}</p>
                </div>
                <div>
                  <Label>Service Areas</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(user.serviceAreas || ["Historic Districts", "Museums", "Food Tours"]).map((area, index) => (
                      <Badge key={index} variant="secondary">{area}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Languages</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(user.languages || ["English", "French", "Spanish"]).map((lang, index) => (
                      <Badge key={index} variant="outline">{lang}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      default: // home view
        return (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="requests">
                Requests
                {guideBookings.filter(r => r.status === "pending").length > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                    {guideBookings.filter(r => r.status === "pending").length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="tours">My Tours</TabsTrigger>
              <TabsTrigger value="ai-ideas">AI Ideas</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Live Stats Banner */}
              <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">🔴 Live Guide Stats</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm opacity-90">Active Bookings</p>
                      <p className="text-2xl font-bold">{liveStats.activeBookings}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-90">Today's Earnings</p>
                      <p className="text-2xl font-bold">${liveStats.todayEarnings}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-90">Response Time</p>
                      <p className="text-2xl font-bold">{liveStats.responseTime}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-90">Next Tour</p>
                      <p className="text-sm font-medium">
                        {liveStats.nextTour ? `${liveStats.nextTour.time} - ${liveStats.nextTour.client}` : "None scheduled"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                          <div className="flex items-center space-x-2">
                            <p className="text-2xl font-bold">{stat.value}</p>
                            {stat.change && (
                              <Badge variant="secondary" className="text-xs">
                                {stat.change}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{stat.period}</p>
                        </div>
                        <stat.icon className="h-8 w-8 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Activity and Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium">New tour request from Sarah Johnson</p>
                            <p className="text-xs text-gray-500">2 hours ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium">Payment received: $150</p>
                            <p className="text-xs text-gray-500">3 hours ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium">Tour completed: Historic Paris</p>
                            <p className="text-xs text-gray-500">5 hours ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">This Week's Earnings</span>
                        <span className="font-semibold">${earnings.thisWeek}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">This Month's Earnings</span>
                        <span className="font-semibold">${earnings.thisMonth}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Reviews</span>
                        <span className="font-semibold">{user.totalReviews || "23"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Response Rate</span>
                        <span className="font-semibold">98%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Requests Tab */}
            <TabsContent value="requests" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>New Tour Requests</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {bookingsLoading ? (
                    <p className="text-gray-500 text-center py-8">Loading booking requests...</p>
                  ) : guideBookings.filter(req => req.status === "pending").length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No new requests at the moment.</p>
                  ) : (
                    guideBookings.filter(req => req.status === "pending").map((request) => (
                      <Card key={request.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold">Booking Request #{request.id}</h4>
                              <p className="text-sm text-gray-600">{request.destination}</p>
                              <p className="text-xs text-gray-500">{new Date(request.createdAt).toLocaleDateString()}</p>
                            </div>
                            <Badge variant="outline">${request.budget}</Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                            <div>
                              <span className="text-gray-500">Date:</span>
                              <p className="font-medium">{request.date}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Time:</span>
                              <p className="font-medium">{request.time}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Duration:</span>
                              <p className="font-medium">{request.duration}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Travelers:</span>
                              <p className="font-medium">{request.travelers}</p>
                            </div>
                          </div>
                          
                          {request.specialRequests && (
                            <div className="mb-4">
                              <span className="text-gray-500 text-sm">Special Requests:</span>
                              <p className="text-sm mt-1">{request.specialRequests}</p>
                            </div>
                          )}
                          
                          <div className="flex space-x-3">
                            <Button 
                              size="sm" 
                              onClick={() => handleRequestAction(request.id, "accepted")}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Accept
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleRequestAction(request.id, "declined")}
                            >
                              Decline
                            </Button>
                            <Button size="sm" variant="ghost">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Message
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* My Tours Tab */}
            <TabsContent value="tours" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Active Tours
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">Historic Paris Walking Tour</h4>
                            <p className="text-sm text-gray-600">Montmartre & Sacré-Cœur</p>
                            <p className="text-xs text-gray-500">Next: Today, 2:00 PM</p>
                          </div>
                          <Badge variant="default">Active</Badge>
                        </div>
                        <div className="mt-3 text-sm">
                          <p><span className="text-gray-500">Duration:</span> 3 hours</p>
                          <p><span className="text-gray-500">Price:</span> $85/person</p>
                          <p><span className="text-gray-500">Max guests:</span> 8</p>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">Seine River Food Tour</h4>
                            <p className="text-sm text-gray-600">Local Markets & Cafes</p>
                            <p className="text-xs text-gray-500">Next: Tomorrow, 10:00 AM</p>
                          </div>
                          <Badge variant="default">Active</Badge>
                        </div>
                        <div className="mt-3 text-sm">
                          <p><span className="text-gray-500">Duration:</span> 4 hours</p>
                          <p><span className="text-gray-500">Price:</span> $120/person</p>
                          <p><span className="text-gray-500">Max guests:</span> 6</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Upcoming Bookings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Sarah Johnson</p>
                            <p className="text-sm text-gray-600">Historic Paris Walking Tour</p>
                            <p className="text-xs text-gray-500">Today, 2:00 PM - 2 guests</p>
                          </div>
                          <Badge variant="outline">Confirmed</Badge>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Mike Chen Family</p>
                            <p className="text-sm text-gray-600">Seine River Food Tour</p>
                            <p className="text-xs text-gray-500">Tomorrow, 10:00 AM - 4 guests</p>
                          </div>
                          <Badge variant="outline">Confirmed</Badge>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Emma Rodriguez</p>
                            <p className="text-sm text-gray-600">Custom Architecture Tour</p>
                            <p className="text-xs text-gray-500">Jan 20, 3:00 PM - 3 guests</p>
                          </div>
                          <Badge variant="secondary">Pending</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* AI Ideas Tab */}
            <TabsContent value="ai-ideas" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    AI Tour Idea Generator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="idea-prompt">Enter a destination or theme for tour ideas</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="idea-prompt"
                        placeholder="e.g., Historic Paris, Tokyo Food Culture, London Art Scene"
                        value={ideaPrompt}
                        onChange={(e) => setIdeaPrompt(e.target.value)}
                      />
                      <Button 
                        onClick={generateTourIdea}
                        disabled={isGenerating}
                        className="bg-gradient-to-r from-purple-600 to-blue-600"
                      >
                        {isGenerating ? "Generating..." : "Generate"}
                      </Button>
                    </div>
                  </div>
                  
                  {tourIdeas.length > 0 && (
                    <div className="space-y-4 mt-6">
                      <h4 className="font-semibold">Generated Tour Ideas</h4>
                      {tourIdeas.map((idea) => (
                        <Card key={idea.id} className="border-l-4 border-l-purple-500">
                          <CardContent className="p-4">
                            <h5 className="font-semibold mb-2">{idea.title}</h5>
                            <p className="text-sm text-gray-600 mb-3">{idea.description}</p>
                            
                            <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                              <div>
                                <span className="text-gray-500">Duration:</span>
                                <p className="font-medium">{idea.duration}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Suggested Price:</span>
                                <p className="font-medium">{idea.suggestedPrice}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Difficulty:</span>
                                <p className="font-medium">{idea.difficulty}</p>
                              </div>
                            </div>
                            
                            <div className="mb-3">
                              <span className="text-gray-500 text-sm">Highlights:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {idea.highlights.map((highlight, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {highlight}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <Button size="sm" variant="outline">
                              Save as Template
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Guide Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Personal Information</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-gray-500">Name:</span> {user.name}</p>
                        <p><span className="text-gray-500">Email:</span> {user.email}</p>
                        <p><span className="text-gray-500">Phone:</span> {user.phone}</p>
                        <p><span className="text-gray-500">Experience:</span> {user.experience}</p>
                        {user.certification && (
                          <p><span className="text-gray-500">Certification:</span> {user.certification}</p>
                        )}
                        {user.hourlyRate && (
                          <p><span className="text-gray-500">Hourly Rate:</span> ${user.hourlyRate}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Statistics</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-gray-500">Total Earnings:</span> ${earnings.total}</p>
                        <p><span className="text-gray-500">Completed Tours:</span> {user.completedTours || 0}</p>
                        <p><span className="text-gray-500">Rating:</span> {user.rating || "New Guide"}</p>
                        <p><span className="text-gray-500">Total Reviews:</span> {user.totalReviews || 0}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Bio</h4>
                    <p className="text-sm text-gray-700">{user.bio}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Service Areas
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {user.serviceAreas?.map((area: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Languages
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {user.languages?.map((language: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {language}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        Tour Interests
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {user.tourInterests?.map((interest: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header with Hamburger Menu */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              {/* Hamburger Menu */}
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <div className="flex flex-col h-full">
                    <div className="border-b pb-4 mb-4">
                      <h2 className="text-lg font-semibold">Guide Menu</h2>
                      <p className="text-sm text-gray-600">{user.name}</p>
                    </div>
                    
                    <nav className="flex-1 space-y-2">
                      <Button
                        variant={currentView === "home" ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => {
                          setCurrentView("home");
                          setIsMenuOpen(false);
                        }}
                      >
                        <Home className="h-4 w-4 mr-2" />
                        Home
                      </Button>
                      
                      <Button
                        variant={currentView === "transactions" ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => {
                          setCurrentView("transactions");
                          setIsMenuOpen(false);
                        }}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Transactions
                      </Button>
                      
                      <Button
                        variant={currentView === "profile" ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => {
                          setCurrentView("profile");
                          setIsMenuOpen(false);
                        }}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Button>
                      
                      <Separator className="my-4" />
                      
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          setIsMenuOpen(false);
                          // Add settings functionality
                        }}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                    </nav>
                    
                    <div className="border-t pt-4">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          setIsMenuOpen(false);
                          onLogout();
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentView === "home" ? "Local Guide Dashboard" :
                   currentView === "transactions" ? "Transactions" :
                   currentView === "profile" ? "Profile" : "Dashboard"}
                </h1>
                <p className="text-gray-600">Welcome back, {user.name}!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {user.rating || "4.9"} Rating
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Response: {liveStats.responseTime}
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
        {renderContent()}
      </div>
    </div>
  );
};

export default GuideDashboard;
