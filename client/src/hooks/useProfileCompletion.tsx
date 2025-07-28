import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useProfileCompletion = () => {
  const { user, isAuthenticated } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const isProfileIncomplete = (user: any) => {
    if (!user || user.role === 'guide') return false; // Skip for guides as they have different flow
    
    // Check if basic profile fields are missing
    const basicFields = [
      user.phone,
      user.dateOfBirth, 
      user.countryOfResidence,
      user.travelStyle,
      user.travelFrequency
    ];
    
    // Profile is incomplete if ANY of the basic fields are missing
    const hasAllBasicInfo = basicFields.every(field => field && field.length > 0);
    return !hasAllBasicInfo;
  };

  const shouldShowProfilePrompt = (user: any) => {
    if (!user || user.role === 'guide') return false;
    
    // Don't show if already shown
    if (user.profileCompletionPromptShown === true) return false;
    
    // Show if profile is incomplete
    return isProfileIncomplete(user);
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('Profile completion check:', {
        userId: user.id,
        role: user.role,
        promptShown: user.profileCompletionPromptShown,
        shouldShow: shouldShowProfilePrompt(user)
      });
      
      // Small delay to ensure auth flow is complete
      const timer = setTimeout(() => {
        if (shouldShowProfilePrompt(user)) {
          console.log('Showing profile modal for user:', user.id);
          setShowProfileModal(true);
        }
      }, 1000); // Increased delay for stability

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user]);

  const handleCloseModal = () => {
    setShowProfileModal(false);
  };

  const handleCompleteProfile = () => {
    setShowProfileModal(false);
    // Force refresh user data after profile completion
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return {
    showProfileModal,
    handleCloseModal,
    handleCompleteProfile,
    isProfileIncomplete: user ? isProfileIncomplete(user) : false
  };
};