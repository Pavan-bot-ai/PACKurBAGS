import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  DollarSign, 
  Calendar, 
  MessageSquare, 
  Brain, 
  TrendingUp,
  Star,
  MapPin,
  Plane,
  Hotel,
  LogOut,
  BarChart3,
  UserCheck,
  AlertCircle
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

const AdminDashboard = ({ user, onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch admin stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: !!user,
  });

  // Fetch all users
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: !!user,
  });

  // Fetch all bookings
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["/api/admin/bookings"],
    enabled: !!user,
  });

  // Fetch feedback
  const { data: feedback, isLoading: feedbackLoading } = useQuery({
    queryKey: ["/api/admin/feedback"],
    enabled: !!user,
  });

  // Fetch AI usage
  const { data: aiUsage, isLoading: aiUsageLoading } = useQuery({
    queryKey: ["/api/admin/ai-usage"],
    enabled: !!user,
  });

  // Fetch tour requests
  const { data: tourRequests, isLoading: tourRequestsLoading } = useQuery({
    queryKey: ["/api/admin/tour-requests"],
    enabled: !!user,
  });

  // Update feedback status mutation
  const updateFeedbackMutation = useMutation({
    mutationFn: async ({ id, status, adminNotes }: { id: number; status: string; adminNotes?: string }) => {
      return apiRequest("PUT", `/api/admin/feedback/${id}`, { status, adminNotes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/feedback"] });
      toast({
        title: "Success",
        description: "Feedback status updated successfully",
      });
    },
  });

  const handleLogout = () => {
    onLogout();
  };

  if (statsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Pack Your Bags - Travel Platform Management</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="ai-usage">AI Usage</TabsTrigger>
            <TabsTrigger value="tours">Tours</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.userStats?.totalUsers || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    +{stats?.userStats?.guides || 0} guides, +{stats?.userStats?.regularUsers || 0} travelers
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats?.revenueStats?.totalRevenue?.toFixed(2) || "0.00"}</div>
                  <p className="text-xs text-muted-foreground">
                    Hotels: ${stats?.revenueStats?.hotelRevenue?.toFixed(2) || "0.00"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.bookingStats?.totalBookings || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.bookingStats?.confirmedBookings || 0} confirmed, {stats?.bookingStats?.pendingBookings || 0} pending
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.bookingStats?.totalPlans || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Trip plans generated
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest user registrations and bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users?.slice(0, 5).map((user: any) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.role} • {user.email}</p>
                        </div>
                        <Badge variant={user.role === 'guide' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Health</CardTitle>
                  <CardDescription>System status and performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Database Status</span>
                      <Badge variant="default">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Payment Processing</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>AI Services</span>
                      <Badge variant="default">Available</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Guide Approvals</span>
                      <Badge variant="secondary">{stats?.userStats?.guides || 0} Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage registered users and local guides</CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Last Active</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users?.map((user: any) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === 'guide' ? 'default' : user.role === 'admin' ? 'destructive' : 'secondary'}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.isRegistrationComplete ? 'default' : 'secondary'}>
                              {user.isRegistrationComplete ? 'Complete' : 'Pending'}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {user.lastActiveAt ? formatDistanceToNow(new Date(user.lastActiveAt), { addSuffix: true }) : 'Never'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Management</CardTitle>
                <CardDescription>Monitor hotel bookings and travel plans</CardDescription>
              </CardHeader>
              <CardContent>
                {bookingsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Hotel</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Guest</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings?.map((booking: any) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.hotelName}</TableCell>
                          <TableCell>{booking.destination}</TableCell>
                          <TableCell>{booking.groupMembers} guests</TableCell>
                          <TableCell>
                            {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>${(booking.totalAmount / 100).toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant={booking.bookingStatus === 'confirmed' ? 'default' : 'secondary'}>
                              {booking.bookingStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={booking.paymentStatus === 'completed' ? 'default' : 'secondary'}>
                              {booking.paymentStatus}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Feedback</CardTitle>
                <CardDescription>Review and manage user feedback and ratings</CardDescription>
              </CardHeader>
              <CardContent>
                {feedbackLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Feedback</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {feedback?.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.userType}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {Array.from({ length: item.rating }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.category}</Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{item.feedbackText}</TableCell>
                          <TableCell>
                            <Badge variant={item.status === 'resolved' ? 'default' : item.status === 'reviewed' ? 'secondary' : 'destructive'}>
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {item.status === 'pending' && (
                                <>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => updateFeedbackMutation.mutate({ id: item.id, status: 'reviewed' })}
                                  >
                                    Review
                                  </Button>
                                  <Button 
                                    size="sm"
                                    onClick={() => updateFeedbackMutation.mutate({ id: item.id, status: 'resolved', adminNotes: 'Resolved by admin' })}
                                  >
                                    Resolve
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-usage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Usage Analytics</CardTitle>
                <CardDescription>Monitor AI service usage and performance</CardDescription>
              </CardHeader>
              <CardContent>
                {aiUsageLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service</TableHead>
                        <TableHead>Request Type</TableHead>
                        <TableHead>Tokens Used</TableHead>
                        <TableHead>Response Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {aiUsage?.map((usage: any) => (
                        <TableRow key={usage.id}>
                          <TableCell>
                            <Badge variant="outline">{usage.serviceType}</Badge>
                          </TableCell>
                          <TableCell>{usage.requestType}</TableCell>
                          <TableCell>{usage.tokensUsed}</TableCell>
                          <TableCell>{usage.responseTime}ms</TableCell>
                          <TableCell>
                            <Badge variant={usage.success ? 'default' : 'destructive'}>
                              {usage.success ? 'Success' : 'Failed'}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(usage.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tours" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tour Management</CardTitle>
                <CardDescription>Monitor tour requests and guide activities</CardDescription>
              </CardHeader>
              <CardContent>
                {tourRequestsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Traveler</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Travelers</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tourRequests?.map((request: any) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.travelerName}</TableCell>
                          <TableCell>{request.destination}</TableCell>
                          <TableCell>{request.date}</TableCell>
                          <TableCell>{request.duration}</TableCell>
                          <TableCell>{request.travelers}</TableCell>
                          <TableCell>{request.budget}</TableCell>
                          <TableCell>
                            <Badge variant={request.status === 'accepted' ? 'default' : request.status === 'pending' ? 'secondary' : 'destructive'}>
                              {request.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{request.timeAgo}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;