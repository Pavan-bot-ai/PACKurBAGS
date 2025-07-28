import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";

import { Router, Route, Switch } from "wouter";

// Auth Components
import AuthPageModal from "./components/AuthPageModal";
import GuideRegistration from "./pages/GuideRegistration";
import UserDashboard from "./pages/UserDashboard";
import GuideDashboard from "./pages/GuideDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// Existing Components
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BookedPlans from "./pages/BookedPlans";
import Transactions from "./pages/Transactions";
import TransactionDetails from "./pages/TransactionDetails";
import SavedPlaces from "./pages/SavedPlaces";
import TripHistory from "./pages/TripHistory";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import Settings from "./pages/Settings";
import PlanGeneration from "./pages/PlanGeneration";
import BookingFlow from "./pages/BookingFlow";
import BookingSuccess from "./pages/BookingSuccess";
import HotelBooking from "./pages/HotelBooking";
import HotelPayment from "./pages/HotelPayment";
import PaymentStatus from "./pages/PaymentStatus";
import HotelBookingSuccess from "./pages/HotelBookingSuccess";
import TripPaymentSummary from "./pages/TripPaymentSummary";
import TripPaymentMethods from "./pages/TripPaymentMethods";
import TripPaymentDetails from "./pages/TripPaymentDetails";
import TripPaymentStatus from "./pages/TripPaymentStatus";

interface AppContentProps {
  showAuth: boolean;
  setShowAuth: (show: boolean) => void;
  showGuideRegistration: boolean;
  setShowGuideRegistration: (show: boolean) => void;
}

const AppContent = ({ showAuth, setShowAuth, showGuideRegistration, setShowGuideRegistration }: AppContentProps) => {
  const { user, isLoading, logout } = useAuth();

  const handleAuthSuccess = (user: any) => {
    setShowAuth(false);
    setShowGuideRegistration(false);
  };

  const handleGuideRegistration = () => {
    setShowAuth(false);
    setShowGuideRegistration(true);
  };

  const handleGuideRegistrationComplete = (user: any) => {
    setShowGuideRegistration(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleLoginClick = () => {
    setShowAuth(true);
  };

  const handleAuthClose = () => {
    setShowAuth(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Debug logging for authentication state
  console.log("App.tsx - User state:", {
    user: user ? {
      id: user.id,
      username: user.username,
      role: user.role,
      isRegistrationComplete: user.isRegistrationComplete,
      profileCompleted: user.profileCompleted
    } : null,
    isLoading
  });

  // Show Guide Registration if user is guide but registration not complete
  if (showGuideRegistration || (user?.role === "guide" && !user?.isRegistrationComplete)) {
    return (
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <GuideRegistration 
          onRegistrationComplete={handleGuideRegistrationComplete}
          onBack={() => {
            setShowGuideRegistration(false);
            setShowAuth(true);
          }}
        />
      </TooltipProvider>
    );
  }

  // Show Role-Based Dashboard for authenticated guides (they go directly to dashboard)
  if (user?.role === "guide" && user?.isRegistrationComplete) {
    console.log("Showing GuideDashboard for user:", user.username, "role:", user.role, "isRegistrationComplete:", user.isRegistrationComplete);
    return (
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <GuideDashboard user={user} onLogout={handleLogout} />
      </TooltipProvider>
    );
  }

  // Show Admin Dashboard for admin users
  if (user?.role === "admin") {
    return (
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AdminDashboard user={user} onLogout={handleLogout} />
      </TooltipProvider>
    );
  }

  // Show home page for everyone else (logged in users, guests, and users with modal auth)
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
        <Router>
        <Switch>
          <Route path="/dashboard" component={() => 
            user?.role === "user" ? (
              <UserDashboard user={user} onLogout={handleLogout} />
            ) : (
              <Index onLoginClick={handleLoginClick} currentUser={user} onLogout={handleLogout} />
            )
          } />
          <Route path="/" component={() => (
            <Index 
              onLoginClick={handleLoginClick} 
              currentUser={user} 
              onLogout={handleLogout}
            />
          )} />
          <Route path="/booked-plans" component={BookedPlans} />
          <Route path="/transactions" component={Transactions} />
          <Route path="/transaction-details/:tripId" component={TransactionDetails} />
          <Route path="/saved-places" component={SavedPlaces} />
          <Route path="/trip-history" component={TripHistory} />
          <Route path="/profile" component={Profile} />
          <Route path="/profile/edit" component={ProfileEdit} />
          <Route path="/settings" component={Settings} />
          <Route path="/plan-generation" component={PlanGeneration} />
          <Route path="/booking-flow" component={BookingFlow} />
          <Route path="/booking-success" component={BookingSuccess} />
          <Route path="/hotel-booking" component={HotelBooking} />
          <Route path="/hotel-payment" component={HotelPayment} />
          <Route path="/payment-status" component={PaymentStatus} />
          <Route path="/hotel-booking-success" component={HotelBookingSuccess} />
          <Route path="/trip-payment-summary" component={TripPaymentSummary} />
          <Route path="/trip-payment-methods" component={TripPaymentMethods} />
          <Route path="/trip-payment-details" component={TripPaymentDetails} />
          <Route path="/trip-payment-status" component={TripPaymentStatus} />
          <Route path="/admin" component={() => 
            user?.role === "admin" ? (
              <AdminDashboard user={user} onLogout={handleLogout} />
            ) : (
              <Index onLoginClick={handleLoginClick} currentUser={user} onLogout={handleLogout} />
            )
          } />
          <Route component={NotFound} />
        </Switch>
      </Router>

      {/* Auth Modal */}
      {showAuth && (
        <AuthPageModal 
          isOpen={showAuth}
          onClose={handleAuthClose}
          onAuthSuccess={handleAuthSuccess}
          onGuideRegistration={handleGuideRegistration}
        />
      )}
    </TooltipProvider>
  );
};

const App = () => {
  const [showGuideRegistration, setShowGuideRegistration] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <AppContent 
            showAuth={showAuth}
            setShowAuth={setShowAuth}
            showGuideRegistration={showGuideRegistration}
            setShowGuideRegistration={setShowGuideRegistration}
          />
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
