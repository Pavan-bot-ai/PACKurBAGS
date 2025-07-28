
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  Menu,
  Calendar,
  CreditCard,
  MapPin,
  Settings,
  User,
  History,
  Heart
} from "lucide-react";
import { useLocation } from "wouter";

interface HamburgerMenuProps {
  isLoggedIn: boolean;
  onMenuItemClick: (item: string) => void;
}

const HamburgerMenu = ({ isLoggedIn, onMenuItemClick }: HamburgerMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [, setLocation] = useLocation();

  const menuItems = [
    { id: 'booked-plans', label: 'Booked Plans', icon: Calendar, requiresAuth: true, route: '/booked-plans' },
    { id: 'transactions', label: 'Transactions', icon: CreditCard, requiresAuth: true, route: '/transactions' },
    { id: 'saved-places', label: 'Saved Places', icon: Heart, requiresAuth: true, route: '/saved-places' },
    { id: 'trip-history', label: 'Trip History', icon: History, requiresAuth: true, route: '/trip-history' },
    { id: 'profile', label: 'Profile', icon: User, requiresAuth: true, route: '/profile' },
    { id: 'settings', label: 'Settings', icon: Settings, requiresAuth: false, route: '/settings' },
  ];

  const handleItemClick = (itemId: string, route?: string) => {
    if (route) {
      setLocation(route);
    } else {
      onMenuItemClick(itemId);
    }
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            Access your travel plans and account settings
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isDisabled = item.requiresAuth && !isLoggedIn;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full justify-start h-12 ${
                  isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => !isDisabled && handleItemClick(item.id, item.route)}
                disabled={isDisabled}
              >
                <IconComponent className="mr-3 h-5 w-5" />
                {item.label}
                {isDisabled && (
                  <span className="ml-auto text-xs text-gray-500">Login required</span>
                )}
              </Button>
            );
          })}
        </div>
        
        {!isLoggedIn && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 mb-2">
              Sign in to access all features
            </p>
            <Button 
              className="w-full" 
              onClick={() => handleItemClick('login')}
            >
              Login / Sign Up
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default HamburgerMenu;
