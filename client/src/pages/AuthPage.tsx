import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Eye, EyeOff, User, MapPin, Mail, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AuthPageProps {
  onAuthSuccess: (user: any) => void;
  onGuideRegistration: () => void;
}

const AuthPage = ({ onAuthSuccess, onGuideRegistration }: AuthPageProps) => {
  const [isGuideMode, setIsGuideMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Get users from localStorage
  const getStoredUsers = () => {
    const users = localStorage.getItem("travelApp_users");
    return users ? JSON.parse(users) : [];
  };

  // Save users to localStorage
  const saveUsers = (users: any[]) => {
    localStorage.setItem("travelApp_users", JSON.stringify(users));
  };

  // Handle login
  const handleLogin = () => {
    if (!loginEmail || !loginPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const users = getStoredUsers();
    const user = users.find((u: any) => u.email === loginEmail && u.password === loginPassword);

    if (!user) {
      toast({
        title: "Error",
        description: "Invalid email or password",
        variant: "destructive",
      });
      return;
    }

    // Check role mismatch
    if ((isGuideMode && user.role !== "guide") || (!isGuideMode && user.role === "guide")) {
      toast({
        title: "Role Mismatch",
        description: `This account is registered as a ${user.role === "guide" ? "Local Guide" : "User"}. Please switch the toggle.`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Logged in successfully!",
    });

    // Set current user in localStorage
    localStorage.setItem("travelApp_currentUser", JSON.stringify(user));
    onAuthSuccess(user);
  };

  // Handle signup
  const handleSignup = () => {
    if (!signupName || !signupEmail || !signupPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (signupPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (signupPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    const users = getStoredUsers();
    
    // Check if email already exists
    if (users.find((u: any) => u.email === signupEmail)) {
      toast({
        title: "Error",
        description: "An account with this email already exists",
        variant: "destructive",
      });
      return;
    }

    const newUser = {
      id: Date.now(),
      name: signupName,
      email: signupEmail,
      password: signupPassword,
      role: isGuideMode ? "guide" : "user",
      createdAt: new Date().toISOString(),
      isRegistrationComplete: !isGuideMode, // User registration is complete, guide needs more details
    };

    users.push(newUser);
    saveUsers(users);

    toast({
      title: "Success",
      description: "Account created successfully!",
    });

    // Set current user in localStorage
    localStorage.setItem("travelApp_currentUser", JSON.stringify(newUser));

    if (isGuideMode) {
      // Redirect to guide registration for additional details
      onGuideRegistration();
    } else {
      // Redirect to user dashboard
      onAuthSuccess(newUser);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl">
        <CardHeader className="space-y-4">
          <div className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Pack Your Bags
            </CardTitle>
            <p className="text-gray-600 mt-2">Your AI Travel Companion</p>
          </div>

          {/* Role Selection Toggle */}
          <div className="flex items-center justify-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <User className="h-5 w-5 text-blue-600" />
            <span className={`text-sm font-medium ${!isGuideMode ? 'text-blue-600' : 'text-gray-500'}`}>
              User
            </span>
            <Switch
              checked={isGuideMode}
              onCheckedChange={setIsGuideMode}
              className="data-[state=checked]:bg-purple-600"
            />
            <span className={`text-sm font-medium ${isGuideMode ? 'text-purple-600' : 'text-gray-500'}`}>
              Local Guide
            </span>
            <MapPin className="h-5 w-5 text-purple-600" />
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loginEmail">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="loginEmail"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="loginPassword">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="loginPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Login as {isGuideMode ? "Local Guide" : "User"}
              </Button>
            </TabsContent>

            {/* Signup Form */}
            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signupName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signupName"
                    placeholder="Enter your full name"
                    className="pl-10"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signupEmail">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signupEmail"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signupPassword">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signupPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className="pl-10 pr-10"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                onClick={handleSignup}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Sign Up as {isGuideMode ? "Local Guide" : "User"}
              </Button>

              {isGuideMode && (
                <p className="text-xs text-gray-600 text-center">
                  After creating your account, you'll complete your guide profile with service areas and languages.
                </p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;