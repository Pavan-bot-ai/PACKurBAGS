import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  CheckCircle, 
  Plane, 
  MapPin, 
  Calendar,
  Heart,
  Star
} from "lucide-react";
import confetti from 'canvas-confetti';

interface HappyJourneyPageProps {
  isOpen: boolean;
  onClose: () => void;
  planData?: any;
}

const HappyJourneyPage = ({ isOpen, onClose, planData }: HappyJourneyPageProps) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowAnimation(true);
      
      // Trigger confetti animation
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-pink-400 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 left-32 w-12 h-12 bg-green-400 rounded-full opacity-25 animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 right-10 w-14 h-14 bg-blue-400 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 text-6xl animate-bounce" style={{ animationDelay: '0.5s' }}>✈️</div>
        <div className="absolute top-1/3 right-1/4 text-4xl animate-pulse" style={{ animationDelay: '1.5s' }}>🎉</div>
        <div className="absolute bottom-1/3 left-1/6 text-5xl animate-bounce" style={{ animationDelay: '2s' }}>🌟</div>
        <div className="absolute bottom-1/4 right-1/6 text-4xl animate-pulse" style={{ animationDelay: '1s' }}>🎊</div>
      </div>

      <div className={`bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 text-center relative transform transition-all duration-1000 my-8 ${
        showAnimation ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
      }`}>
        
        {/* Success Icon */}
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto flex items-center justify-center shadow-lg animate-pulse">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-spin">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Main Heading */}
        <div className="mb-6">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4 animate-pulse">
            Happy Journey! 🎉
          </h1>
          <p className="text-2xl text-gray-700 font-semibold mb-2">
            Your adventure awaits!
          </p>
          <p className="text-lg text-gray-600">
            Your travel plan has been successfully saved and confirmed.
          </p>
        </div>

        {/* Plan Saved Message */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-green-700">Plan Successfully Saved!</h3>
          </div>
          <p className="text-green-600 mb-4">
            Your complete travel itinerary is now available in your "Booked Plans" section.
          </p>
          
          {/* Quick Plan Summary */}
          {planData && (
            <div className="bg-white rounded-lg p-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-600">Destination:</span>
                  <span className="font-medium">{planData.destination || 'Bali'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{planData.travelDate || 'Dec 25'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Plane className="w-4 h-4 text-orange-500" />
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{planData.duration || '7 days'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Fun Messages */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-center gap-2 text-lg">
            <Heart className="w-5 h-5 text-red-500 animate-pulse" />
            <span className="text-gray-700">Pack your bags and create memories!</span>
            <Heart className="w-5 h-5 text-red-500 animate-pulse" />
          </div>
          <div className="flex items-center justify-center gap-2 text-lg">
            <Star className="w-5 h-5 text-yellow-500 animate-spin" />
            <span className="text-gray-700">Adventure is calling your name!</span>
            <Star className="w-5 h-5 text-yellow-500 animate-spin" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={onClose}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <MapPin className="w-5 h-5 mr-2" />
            Explore More Destinations
          </Button>
          <Button 
            variant="outline"
            onClick={onClose}
            className="border-2 border-green-500 text-green-600 hover:bg-green-50 px-8 py-3 text-lg font-semibold rounded-xl transform hover:scale-105 transition-all duration-200"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            View My Plans
          </Button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-pink-400 to-red-400 rounded-full animate-bounce"></div>
        <div className="absolute -top-2 -right-6 w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-3 -left-2 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-4 -right-3 w-7 h-7 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
};

export default HappyJourneyPage;