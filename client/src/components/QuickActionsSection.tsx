
import QuickActions from "@/components/QuickActions";

interface QuickActionsSectionProps {
  onActionClick: (feature: string) => void;
}

const QuickActionsSection = ({ onActionClick }: QuickActionsSectionProps) => {
  return (
    <section className="py-12 bg-white/50">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl font-bold text-center mb-8">Quick Actions</h3>
        <QuickActions onActionClick={onActionClick} />
      </div>
    </section>
  );
};

export default QuickActionsSection;
