
import { Button } from "@/components/ui/button";
import { Plane, User, LogIn } from "lucide-react";
import HamburgerMenu from "@/components/HamburgerMenu";

interface HeaderProps {
  isLoggedIn: boolean;
  onMenuItemClick: (item: string) => void;
  onAuthClick: () => void;
  onLogout: () => void;
}

const Header = ({ isLoggedIn, onMenuItemClick, onAuthClick, onLogout }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 glass-morphism">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <HamburgerMenu isLoggedIn={isLoggedIn} onMenuItemClick={onMenuItemClick} />
          <div className="flex items-center">
            <img 
              src="/pack-ur-bags-logo.png" 
              alt="Pack ur Bags Logo" 
              className="h-12 w-auto"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium">Welcome back!</span>
              </div>
              <Button variant="outline" size="sm" onClick={onLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Button 
              onClick={onAuthClick}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login / Sign Up
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
