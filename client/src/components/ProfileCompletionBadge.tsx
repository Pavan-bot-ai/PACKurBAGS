import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, User } from "lucide-react";

interface ProfileCompletionBadgeProps {
  onClick: () => void;
}

export const ProfileCompletionBadge = ({ onClick }: ProfileCompletionBadgeProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-700 transition-colors"
    >
      <AlertCircle className="w-4 h-4 mr-2" />
      Complete Your Profile
    </Button>
  );
};