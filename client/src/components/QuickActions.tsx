
import { Card, CardContent } from "@/components/ui/card";
import { 
  Brain, 
  MapPin, 
  Languages, 
  Calendar 
} from "lucide-react";

interface QuickActionsProps {
  onActionClick: (action: string) => void;
}

const quickActions = [
  {
    id: "trip-planner",
    title: "Smart Trip Planner",
    description: "AI-powered itinerary creation",
    icon: Brain,
    gradient: "from-purple-500 to-pink-500",
    bgColor: "bg-gradient-to-br from-purple-50 to-pink-50"
  },
  {
    id: "local-guide",
    title: "AI Local Guide",
    description: "Personalized recommendations",
    icon: MapPin,
    gradient: "from-blue-500 to-cyan-500",
    bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50"
  },
  {
    id: "translator",
    title: "AI Translator",
    description: "Break language barriers",
    icon: Languages,
    gradient: "from-green-500 to-teal-500",
    bgColor: "bg-gradient-to-br from-green-50 to-teal-50"
  },
  {
    id: "bookings",
    title: "AI Bookings",
    description: "Smart booking assistant",
    icon: Calendar,
    gradient: "from-orange-500 to-red-500",
    bgColor: "bg-gradient-to-br from-orange-50 to-red-50"
  }
];

const QuickActions = ({ onActionClick }: QuickActionsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {quickActions.map((action) => {
        const IconComponent = action.icon;
        return (
          <Card 
            key={action.id}
            className={`${action.bgColor} border-0 card-hover cursor-pointer group`}
            onClick={() => onActionClick(action.id)}
          >
            <CardContent className="p-6 text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${action.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-lg mb-2">{action.title}</h4>
              <p className="text-gray-600 text-sm">{action.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default QuickActions;
