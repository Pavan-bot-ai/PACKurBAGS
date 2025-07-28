
import { useAppState } from "@/hooks/useAppState";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import QuickActionsSection from "@/components/QuickActionsSection";
import VideoReelsSection from "@/components/VideoReelsSection";
import ModalManager from "@/components/ModalManager";


interface IndexProps {
  onLoginClick?: () => void;
  currentUser?: any;
  onLogout?: () => void;
}

const Index = ({ onLoginClick, currentUser, onLogout }: IndexProps = {}) => {
  const {
    // State
    showAuth,
    isLoggedIn,
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
  } = useAppState();



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Header
        isLoggedIn={!!currentUser || isLoggedIn}
        onMenuItemClick={handleMenuItemClick}
        onAuthClick={onLoginClick || (() => setShowAuth(true))}
        onLogout={onLogout || handleLogout}
      />

      <HeroSection
        onPlaceClick={handleTrendingPlaceClick}
        onImageClick={handlePlaceImageClick}
      />

      <QuickActionsSection onActionClick={handleFeatureClick} />

      <VideoReelsSection />

      <ModalManager
        showAuth={showAuth}
        showPlaceDetails={showPlaceDetails}
        showTripPlanner={showTripPlanner}
        showLocalGuide={showLocalGuide}
        showTranslator={showTranslator}
        showBookings={showBookings}
        showTransactions={showTransactions}
        showGuideBooking={showGuideBooking}
        selectedPlaceForDetails={selectedPlaceForDetails}
        selectedDestination={selectedDestination}
        onAuthClose={() => setShowAuth(false)}
        onPlaceDetailsClose={() => setShowPlaceDetails(false)}
        onTripPlannerClose={() => {
          setShowTripPlanner(false);
          setSelectedDestination('');
        }}
        onLocalGuideClose={() => setShowLocalGuide(false)}
        onTranslatorClose={() => setShowTranslator(false)}
        onBookingsClose={() => setShowBookings(false)}
        onTransactionsClose={() => setShowTransactions(false)}
        onGuideBookingClose={() => setShowGuideBooking(false)}
        onLogin={handleLogin}
        onGeneratePlan={handleGeneratePlanFromDetails}
      />


    </div>
  );
};

export default Index;
