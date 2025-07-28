
import { useState } from "react";

export const useAppState = () => {
  // Check authentication from localStorage to avoid context errors
  const isAuthenticated = !!localStorage.getItem('travelApp_token');
  const [showAuth, setShowAuth] = useState(false);
  const [showLocalGuide, setShowLocalGuide] = useState(false);
  const [showTripPlanner, setShowTripPlanner] = useState(false);
  const [showTranslator, setShowTranslator] = useState(false);
  const [showBookings, setShowBookings] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<string>('');
  const [showTransactions, setShowTransactions] = useState(false);
  const [showPlaceDetails, setShowPlaceDetails] = useState(false);
  const [selectedPlaceForDetails, setSelectedPlaceForDetails] = useState<string>('');
  const [showGuideBooking, setShowGuideBooking] = useState(false);

  const handleFeatureClick = (feature: string) => {
    if (!isAuthenticated) {
      setShowAuth(true);
      return;
    }
    
    switch (feature) {
      case 'trip-planner':
        setShowTripPlanner(true);
        break;
      case 'local-guide':
        setShowGuideBooking(true);
        break;
      case 'translator':
        setShowTranslator(true);
        break;
      case 'bookings':
        setShowBookings(true);
        break;
      default:
        console.log(`Opening ${feature}`);
    }
  };

  const handleTrendingPlaceClick = (destination: string) => {
    if (!isAuthenticated) {
      setShowAuth(true);
      return;
    }
    
    setSelectedDestination(destination);
    setShowTripPlanner(true);
  };

  const handleMenuItemClick = (item: string) => {
    if (!isAuthenticated && item !== 'login' && item !== 'settings') {
      setShowAuth(true);
      return;
    }

    switch (item) {
      case 'login':
        setShowAuth(true);
        break;
      case 'booked-plans':
        setShowTripPlanner(true);
        break;
      case 'transactions':
        setShowTransactions(true);
        break;
      case 'saved-places':
        console.log('Opening saved places');
        break;
      case 'trip-history':
        console.log('Opening trip history');
        break;
      case 'profile':
        console.log('Opening profile');
        break;
      case 'settings':
        console.log('Opening settings');
        break;
      default:
        console.log(`Opening ${item}`);
    }
  };

  const handleLogin = (userData: any) => {
    setShowAuth(false);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("travelApp_token");
      
      if (token) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.warn("Network error during logout:", error);
    } finally {
      // Always clear local storage and user state, regardless of server response
      localStorage.removeItem("travelApp_token");
      localStorage.removeItem("travelApp_currentUser");
      // Force page reload to clear all state
      window.location.reload();
    }
  };

  const handlePlaceImageClick = (destination: string) => {
    if (!isAuthenticated) {
      setShowAuth(true);
      return;
    }
    
    setSelectedPlaceForDetails(destination);
    setShowPlaceDetails(true);
  };

  const handleGeneratePlanFromDetails = (planDetails: any) => {
    setSelectedDestination(planDetails.destination);
    console.log('Generating plan with details:', planDetails);
    setShowTripPlanner(true);
  };

  return {
    // State
    showAuth,
    isLoggedIn: isAuthenticated,
    showLocalGuide,
    showTripPlanner,
    showTranslator,
    showBookings,
    selectedDestination,
    showTransactions,
    showPlaceDetails,
    selectedPlaceForDetails,
    showGuideBooking,
    
    // State setters
    setShowAuth,
    setShowLocalGuide,
    setShowTripPlanner,
    setShowTranslator,
    setShowBookings,
    setShowTransactions,
    setShowPlaceDetails,
    setSelectedDestination,
    setShowGuideBooking,
    
    // Event handlers
    handleFeatureClick,
    handleTrendingPlaceClick,
    handleMenuItemClick,
    handleLogin,
    handleLogout,
    handlePlaceImageClick,
    handleGeneratePlanFromDetails,
  };
};
