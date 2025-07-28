
import AuthModal from "@/components/AuthModal";
import PlaceDetailsModal from "@/components/PlaceDetailsModal";
import SmartTripPlanner from "@/components/SmartTripPlanner";
import AILocalGuide from "@/components/AILocalGuide";
import AITranslator from "@/components/AITranslator";
import AIBookings from "@/components/AIBookings";
import TransactionsList from "@/components/TransactionsList";
import { GuideBooking } from "@/components/GuideBooking";

interface ModalManagerProps {
  showAuth: boolean;
  showPlaceDetails: boolean;
  showTripPlanner: boolean;
  showLocalGuide: boolean;
  showTranslator: boolean;
  showBookings: boolean;
  showTransactions: boolean;
  showGuideBooking: boolean;
  selectedPlaceForDetails: string;
  selectedDestination: string;
  onAuthClose: () => void;
  onPlaceDetailsClose: () => void;
  onTripPlannerClose: () => void;
  onLocalGuideClose: () => void;
  onTranslatorClose: () => void;
  onBookingsClose: () => void;
  onTransactionsClose: () => void;
  onGuideBookingClose: () => void;
  onLogin: (userData: any) => void;
  onGeneratePlan: (planDetails: any) => void;
}

const ModalManager = ({
  showAuth,
  showPlaceDetails,
  showTripPlanner,
  showLocalGuide,
  showTranslator,
  showBookings,
  showTransactions,
  showGuideBooking,
  selectedPlaceForDetails,
  selectedDestination,
  onAuthClose,
  onPlaceDetailsClose,
  onTripPlannerClose,
  onLocalGuideClose,
  onTranslatorClose,
  onBookingsClose,
  onTransactionsClose,
  onGuideBookingClose,
  onLogin,
  onGeneratePlan,
}: ModalManagerProps) => {
  return (
    <>
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuth}
        onClose={onAuthClose}
        onLogin={onLogin}
      />

      {/* Place Details Modal */}
      <PlaceDetailsModal 
        isOpen={showPlaceDetails}
        onClose={onPlaceDetailsClose}
        destination={selectedPlaceForDetails}
        onGeneratePlan={onGeneratePlan}
      />

      {/* Smart Trip Planner Modal */}
      <SmartTripPlanner 
        isOpen={showTripPlanner}
        onClose={onTripPlannerClose}
        defaultDestination={selectedDestination}
      />

      {/* AI Local Guide Modal */}
      <AILocalGuide 
        isOpen={showLocalGuide}
        onClose={onLocalGuideClose}
      />

      {/* AI Translator Modal */}
      <AITranslator 
        isOpen={showTranslator}
        onClose={onTranslatorClose}
      />

      {/* AI Bookings Modal */}
      <AIBookings 
        isOpen={showBookings}
        onClose={onBookingsClose}
      />

      {/* Transactions Modal */}
      <TransactionsList 
        isOpen={showTransactions}
        onClose={onTransactionsClose}
      />

      {/* Guide Booking Modal */}
      {showGuideBooking && (
        <GuideBooking 
          onClose={onGuideBookingClose}
        />
      )}
    </>
  );
};

export default ModalManager;
