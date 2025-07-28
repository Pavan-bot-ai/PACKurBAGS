import { ProfileCompletionModal } from "./ProfileCompletionModal";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";

interface ProfileCompletionWrapperProps {
  children: React.ReactNode;
}

export const ProfileCompletionWrapper = ({ children }: ProfileCompletionWrapperProps) => {
  const { showProfileModal, handleCloseModal, handleCompleteProfile } = useProfileCompletion();

  return (
    <>
      {children}
      <ProfileCompletionModal
        isOpen={showProfileModal}
        onClose={handleCloseModal}
        onComplete={handleCompleteProfile}
      />
    </>
  );
};