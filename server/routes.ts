import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { pool } from "./db";
import bcrypt from "bcrypt";
import crypto from "crypto";
import path from "path";
import express from "express";
import { insertUserSchema, insertTransactionSchema, insertSavedPlaceSchema, insertHotelBookingSchema, insertBookedPlanSchema, insertGuideBookingSchema, insertGuideMessageSchema, insertGuideNotificationSchema } from "@shared/schema";
import { WebSocketServer } from 'ws';
import WebSocket from 'ws';

// Authentication middleware
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const user = await storage.getUserBySessionToken(token);
    if (!user) {
      return res.sendStatus(401);
    }
    req.user = user;
    next();
  } catch (error) {
    return res.sendStatus(403);
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Helper function to generate session token
  const generateSessionToken = (): string => {
    return crypto.randomBytes(32).toString('hex');
  };



  // New unified authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { name, email, password, role = "user" } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create username from email
      const username = email.split('@')[0];
      
      // Create user with basic profile filled
      const user = await storage.createUser({ 
        username,
        email, 
        password: hashedPassword,
        name,
        role,
        isRegistrationComplete: role === "user", // Users complete registration immediately, guides need more steps
        countryOfResidence: "Not specified",
        travelStyle: "Explorer",
        travelFrequency: "Occasionally",
        preferredDestinations: [],
        dietaryPreferences: []
      });
      
      // Generate session token
      const sessionToken = generateSessionToken();
      const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      
      await storage.updateUserSession(user.id, sessionToken, expiryDate);
      
      res.json({ 
        token: sessionToken, 
        user: { 
          id: user.id, 
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          isRegistrationComplete: user.isRegistrationComplete,
          language: user.language,
          countryOfResidence: user.countryOfResidence,
          travelStyle: user.travelStyle,
          travelFrequency: user.travelFrequency,
          preferredDestinations: user.preferredDestinations,
          dietaryPreferences: user.dietaryPreferences,
          phone: user.phone,
          dateOfBirth: user.dateOfBirth,
          passportCountry: user.passportCountry,
          emergencyContact: user.emergencyContact,
          profileCompletionPromptShown: user.profileCompletionPromptShown,
          createdAt: user.createdAt,
          lastActiveAt: user.lastActiveAt
        } 
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/signin", async (req, res) => {
    try {
      const { email, password, role } = req.body;
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Check role mismatch
      if (user.role !== role) {
        return res.status(401).json({ 
          error: `This account is registered as a ${user.role === "guide" ? "Local Guide" : "User"}. Please switch the toggle.` 
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Generate session token
      const sessionToken = generateSessionToken();
      const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      
      await storage.updateUserSession(user.id, sessionToken, expiryDate);
      
      res.json({ 
        token: sessionToken, 
        user: { 
          id: user.id, 
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          isRegistrationComplete: user.isRegistrationComplete,
          profileCompleted: user.profileCompleted,
          language: user.language,
          countryOfResidence: user.countryOfResidence,
          travelStyle: user.travelStyle,
          travelFrequency: user.travelFrequency,
          preferredDestinations: user.preferredDestinations,
          dietaryPreferences: user.dietaryPreferences,
          phone: user.phone,
          dateOfBirth: user.dateOfBirth,
          passportCountry: user.passportCountry,
          emergencyContact: user.emergencyContact,
          profileCompletionPromptShown: user.profileCompletionPromptShown,
          // Include guide-specific fields for guide users
          bio: user.bio,
          experience: user.experience,
          certification: user.certification,
          hourlyRate: user.hourlyRate,
          serviceAreas: user.serviceAreas,
          languages: user.languages,
          tourInterests: user.tourInterests,
          profileImageUrl: user.profileImageUrl,
          rating: user.rating,
          totalReviews: user.totalReviews,
          totalEarnings: user.totalEarnings,
          completedTours: user.completedTours,
          createdAt: user.createdAt,
          lastActiveAt: user.lastActiveAt
        } 
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: any, res) => {
    res.json(req.user);
  });

  app.post("/api/auth/logout", authenticateToken, async (req: any, res) => {
    try {
      await storage.clearUserSession(req.user.id);
      res.json({ message: "Logged out successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Profile completion routes
  app.post("/api/auth/complete-profile", authenticateToken, async (req: any, res) => {
    try {
      const profileData = req.body;
      
      const updatedUser = await storage.updateUserProfile(req.user.id, {
        ...profileData,
        profileCompletionPromptShown: true
      });

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        user: updatedUser
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/mark-prompt-shown", authenticateToken, async (req: any, res) => {
    try {
      const updatedUser = await storage.updateUserProfile(req.user.id, {
        profileCompletionPromptShown: true
      });

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ message: "Prompt marked as shown" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Guide profile completion route
  app.post("/api/auth/complete-guide-profile", authenticateToken, async (req: any, res) => {
    try {
      const guideData = req.body;
      
      // Ensure the user is a guide
      if (req.user.role !== "guide") {
        return res.status(403).json({ error: "Only guides can complete guide profiles" });
      }

      const updatedUser = await storage.updateUserGuideProfile(req.user.id, {
        ...guideData,
        profileCompleted: true,
        isRegistrationComplete: true
      });

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role,
          isRegistrationComplete: updatedUser.isRegistrationComplete,
          profileCompleted: updatedUser.profileCompleted,
          language: updatedUser.language,
          // Include guide-specific fields
          bio: updatedUser.bio,
          phone: updatedUser.phone,
          experience: updatedUser.experience,
          certification: updatedUser.certification,
          hourlyRate: updatedUser.hourlyRate,
          serviceAreas: updatedUser.serviceAreas,
          languages: updatedUser.languages,
          tourInterests: updatedUser.tourInterests,
          profileImageUrl: updatedUser.profileImageUrl,
          rating: updatedUser.rating,
          totalReviews: updatedUser.totalReviews,
          totalEarnings: updatedUser.totalEarnings,
          completedTours: updatedUser.completedTours
        }
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Original authentication routes (legacy support)
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password } = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const user = await storage.createUser({ username, password: hashedPassword });
      
      // Generate session token
      const sessionToken = crypto.randomBytes(32).toString('hex');
      const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      
      await storage.updateUserSession(user.id, sessionToken, expiryDate);
      
      res.json({ 
        token: sessionToken, 
        user: { 
          id: user.id, 
          username: user.username, 
          language: user.language 
        } 
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Find user
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate session token
      const sessionToken = crypto.randomBytes(32).toString('hex');
      const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      
      const updatedUser = await storage.updateUserSession(user.id, sessionToken, expiryDate);
      
      res.json({ 
        token: sessionToken, 
        user: { 
          id: updatedUser!.id, 
          username: updatedUser!.username, 
          language: updatedUser!.language 
        } 
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: any, res) => {
    res.json({
      id: req.user.id,
      username: req.user.username,
      language: req.user.language
    });
  });

  app.post("/api/auth/activity", authenticateToken, async (req: any, res) => {
    try {
      await storage.updateUserActivity(req.user.id);
      res.json({ message: "Activity updated" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/auth/language", authenticateToken, async (req: any, res) => {
    try {
      const { language } = req.body;
      const updatedUser = await storage.updateUserLanguage(req.user.id, language);
      res.json({
        id: updatedUser!.id,
        username: updatedUser!.username,
        language: updatedUser!.language
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Transaction routes
  app.post("/api/transactions", async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(validatedData);
      res.json(transaction);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/transactions", authenticateToken, async (req: any, res) => {
    try {
      const transactions = await storage.getTransactionsByUser(req.user.id);
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/transactions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const transaction = await storage.getTransactionById(id);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/transactions/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const transaction = await storage.updateTransactionStatus(id, status);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Saved Places routes
  app.get("/api/saved-places", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      const savedPlaces = await storage.getSavedPlacesByUser(parseInt(userId));
      res.json(savedPlaces);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/saved-places", async (req, res) => {
    try {
      const validatedData = insertSavedPlaceSchema.parse(req.body);
      const savedPlace = await storage.createSavedPlace(validatedData);
      res.json(savedPlace);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/saved-places", async (req, res) => {
    try {
      const { userId, placeId } = req.body;
      if (!userId || !placeId) {
        return res.status(400).json({ error: "userId and placeId are required" });
      }
      await storage.removeSavedPlace(parseInt(userId), placeId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/saved-places/check", async (req, res) => {
    try {
      const { userId, placeId } = req.query;
      if (!userId || !placeId) {
        return res.status(400).json({ error: "userId and placeId are required" });
      }
      const isSaved = await storage.isPlaceSaved(parseInt(userId as string), placeId as string);
      res.json({ isSaved });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Hotel booking routes
  app.post("/api/hotel-bookings", async (req, res) => {
    try {
      const bookingData = {
        ...req.body,
        userId: req.body.userId || 1 // Mock user ID for now
      };
      
      const booking = await storage.createHotelBooking(bookingData);
      res.json(booking);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/hotel-bookings", async (req, res) => {
    try {
      const userId = req.query.userId || 1; // Mock user ID for now
      const bookings = await storage.getHotelBookingsByUser(parseInt(userId as string));
      res.json(bookings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/hotel-bookings/:id/status", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const booking = await storage.updateHotelBookingStatus(parseInt(id), status);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.json(booking);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Booked Plans routes
  app.post("/api/booked-plans", authenticateToken, async (req: any, res) => {
    try {
      const planData = insertBookedPlanSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      const plan = await storage.createBookedPlan(planData);
      res.json(plan);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/booked-plans", authenticateToken, async (req: any, res) => {
    try {
      const plans = await storage.getBookedPlansByUser(req.user.id);
      res.json(plans);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/booked-plans/:id", authenticateToken, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const plan = await storage.getBookedPlanById(id);
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }
      // Check if the plan belongs to the authenticated user
      if (plan.userId !== req.user.id) {
        return res.status(403).json({ error: "Access denied" });
      }
      res.json(plan);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/booked-plans/:id/status", authenticateToken, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      // Check if the plan belongs to the authenticated user
      const existingPlan = await storage.getBookedPlanById(id);
      if (!existingPlan || existingPlan.userId !== req.user.id) {
        return res.status(404).json({ error: "Plan not found" });
      }
      
      const plan = await storage.updateBookedPlanStatus(id, status);
      res.json(plan);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });



  app.post("/api/admin/feedback", authenticateToken, async (req, res) => {
    try {
      const { rating, category, feedbackText, tripId, guideId } = req.body;
      const userId = req.user.id;
      const userType = req.user.role;

      const feedback = await storage.createAdminFeedback({
        userId,
        userType,
        rating,
        category,
        feedbackText,
        tripId,
        guideId
      });

      res.json(feedback);
    } catch (error: any) {
      console.error("Error creating feedback:", error);
      res.status(500).json({ error: "Failed to create feedback" });
    }
  });

  app.post("/api/admin/ai-usage", authenticateToken, async (req, res) => {
    try {
      const { serviceType, requestType, tokensUsed, responseTime, success, errorMessage, requestData, responseData } = req.body;
      const userId = req.user.id;

      const usage = await storage.createAdminAiUsage({
        userId,
        serviceType,
        requestType,
        tokensUsed,
        responseTime,
        success,
        errorMessage,
        requestData,
        responseData
      });

      res.json(usage);
    } catch (error: any) {
      console.error("Error recording AI usage:", error);
      res.status(500).json({ error: "Failed to record AI usage" });
    }
  });

  // Guide booking routes
  app.get("/api/guides/available", authenticateToken, async (req, res) => {
    try {
      const guides = await storage.getAvailableGuides();
      res.json(guides);
    } catch (error) {
      console.error("Error fetching available guides:", error);
      res.status(500).json({ error: "Failed to fetch guides" });
    }
  });

  app.post("/api/guide-bookings", authenticateToken, async (req, res) => {
    try {
      const result = insertGuideBookingSchema.safeParse({
        ...req.body,
        userId: req.user.id
      });

      if (!result.success) {
        return res.status(400).json({ error: result.error.message });
      }

      const booking = await storage.createGuideBooking(result.data);
      
      // Create notification for the guide
      await storage.createGuideNotification({
        userId: result.data.guideId,
        type: 'booking_request',
        title: 'New Booking Request',
        message: `New booking request for ${result.data.destination}`,
        relatedId: booking.id
      });

      res.json(booking);
    } catch (error) {
      console.error("Error creating guide booking:", error);
      res.status(500).json({ error: "Failed to create booking" });
    }
  });

  app.get("/api/guide-bookings/user", authenticateToken, async (req, res) => {
    try {
      const bookings = await storage.getGuideBookingsByUser(req.user.id);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  app.get("/api/guide-bookings/guide", authenticateToken, async (req, res) => {
    try {
      const bookings = await storage.getGuideBookingsByGuide(req.user.id);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching guide bookings:", error);
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  app.patch("/api/guide-bookings/:id", authenticateToken, async (req, res) => {
    try {
      const booking = await storage.updateGuideBookingStatus(parseInt(req.params.id), req.body.status);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      // Create notification for the user when booking is accepted or declined
      if (req.body.status === 'accepted' || req.body.status === 'declined') {
        const title = req.body.status === 'accepted' ? 
          "Booking Request Accepted!" : "Booking Request Declined";
        const message = req.body.status === 'accepted' ? 
          `Your guide has accepted your booking for ${booking.destination}` :
          `Your guide has declined your booking for ${booking.destination}`;

        await storage.createUserNotification({
          userId: booking.userId,
          type: `booking_${req.body.status}`,
          title,
          message,
          relatedId: booking.id
        });
      }

      res.json(booking);
    } catch (error) {
      console.error("Error updating booking status:", error);
      res.status(500).json({ error: "Failed to update booking" });
    }
  });

  app.get("/api/guide-bookings/:id", authenticateToken, async (req, res) => {
    try {
      const booking = await storage.getGuideBookingById(parseInt(req.params.id));
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      console.error("Error fetching booking:", error);
      res.status(500).json({ error: "Failed to fetch booking" });
    }
  });

  app.get("/api/guide-bookings/:id/messages", authenticateToken, async (req, res) => {
    try {
      const messages = await storage.getMessagesByBooking(parseInt(req.params.id));
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/guide-bookings/:id/messages", authenticateToken, async (req, res) => {
    try {
      const result = insertGuideMessageSchema.safeParse({
        ...req.body,
        bookingId: parseInt(req.params.id),
        senderId: req.user.id,
        senderType: req.user.role || 'user'
      });

      if (!result.success) {
        return res.status(400).json({ error: result.error.message });
      }

      const message = await storage.createGuideMessage(result.data);
      res.json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // Admin routes (before WebSocket server)
  app.post("/api/admin/login", async (req, res) => {
    const { email, password } = req.body;
    
    // Admin credentials check
    if (email === "admin@packyourbags.com" && password === "admin123") {
      const token = "admin_" + Math.random().toString(36).substr(2, 15);
      res.json({ token, role: "admin" });
    } else {
      res.status(401).json({ error: "Invalid admin credentials" });
    }
  });

  app.get("/api/admin/verify", (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (token && token.startsWith("admin_")) {
      res.json({ valid: true });
    } else {
      res.status(401).json({ error: "Invalid admin token" });
    }
  });

  // Admin middleware
  const adminAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token || !token.startsWith("admin_")) {
      return res.status(401).json({ error: "Admin access required" });
    }
    next();
  };

  app.get("/api/admin/stats", adminAuthMiddleware, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const bookings = await storage.getAllHotelBookings();
      const transactions = await storage.getAllTransactions();
      
      const totalUsers = users.filter(u => u.role === 'user' || !u.role).length;
      const totalGuides = users.filter(u => u.role === 'guide').length;
      const totalBookings = bookings.length;
      const totalRevenue = transactions.reduce((sum, t) => sum + parseFloat(t.amount || '0'), 0);

      res.json({
        totalUsers,
        totalGuides,
        totalBookings,
        totalRevenue: totalRevenue.toFixed(2)
      });
    } catch (error) {
      console.error("Admin stats error:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.get("/api/admin/users", adminAuthMiddleware, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Admin users error:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.get("/api/admin/users/:id", adminAuthMiddleware, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUserById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Admin get user error:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.post("/api/admin/users", adminAuthMiddleware, async (req, res) => {
    try {
      const { username, email, role, status, password } = req.body;
      
      if (!username || !email || !password) {
        return res.status(400).json({ error: "Username, email, and password are required" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const userData = {
        username,
        name: username,
        email,
        password: hashedPassword,
        role: role || 'user',
        status: status || 'active'
      };

      const newUser = await storage.createUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      console.error("Admin create user error:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.put("/api/admin/users/:id", adminAuthMiddleware, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { username, email, role, status, password } = req.body;
      
      const existingUser = await storage.getUserById(userId);
      if (!existingUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const updateData: any = {
        username,
        name: username,
        email,
        role,
        status
      };

      // Only update password if provided
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const updatedUser = await storage.updateUser(userId, updateData);
      res.json(updatedUser);
    } catch (error) {
      console.error("Admin update user error:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.post("/api/admin/users/:id/suspend", adminAuthMiddleware, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { reason, fromDate, toDate } = req.body;
      
      const existingUser = await storage.getUserById(userId);
      if (!existingUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Update user status to suspended
      const updatedUser = await storage.updateUser(userId, { 
        status: 'suspended',
        suspensionReason: reason,
        suspensionFromDate: fromDate,
        suspensionToDate: toDate
      });

      res.json(updatedUser);
    } catch (error) {
      console.error("Admin suspend user error:", error);
      res.status(500).json({ error: "Failed to suspend user" });
    }
  });

  app.delete("/api/admin/users/:id", adminAuthMiddleware, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      const existingUser = await storage.getUserById(userId);
      if (!existingUser) {
        return res.status(404).json({ error: "User not found" });
      }

      await storage.deleteUser(userId);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Admin delete user error:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  app.get("/api/admin/bookings", adminAuthMiddleware, async (req, res) => {
    try {
      // Fetch all types of bookings from database
      const hotelBookings = await storage.getAllHotelBookings();
      const transportBookings = await storage.getAllTransportBookings();
      const bookedPlans = await storage.getAllBookedPlans();
      const guideBookings = await storage.getGuideBookingsByGuide(0); // Get all guide bookings
      
      // Combine and format all bookings
      const allBookings = [
        // Transport bookings
        ...transportBookings.map(b => ({
          id: `T${b.id}`,
          type: 'transport',
          userName: `User ${b.userId}`,
          guideName: 'N/A',
          destination: JSON.parse(b.serviceDetails || '{}').provider || 'Transport Service',
          date: b.createdAt.toISOString().split('T')[0],
          status: b.bookingStatus,
          totalAmount: parseFloat(b.amount),
          paymentStatus: b.paymentStatus,
          paymentMethod: b.paymentMethod,
          transactionId: b.transactionId
        })),
        // Hotel bookings
        ...hotelBookings.map(b => ({
          id: `H${b.id}`,
          type: 'hotel',
          userName: `User ${b.userId}`,
          guideName: 'N/A',
          destination: b.destination,
          date: b.checkInDate,
          status: b.bookingStatus,
          totalAmount: parseFloat(b.totalAmount),
          paymentStatus: b.paymentStatus,
          paymentMethod: 'Credit Card'
        })),
        // Booked plans
        ...bookedPlans.map(b => ({
          id: `P${b.id}`,
          type: 'plan',
          userName: `User ${b.userId}`,
          guideName: 'N/A',
          destination: b.destination,
          date: b.travelDate,
          status: b.bookingStatus,
          totalAmount: parseFloat(b.totalAmount) / 100, // Convert from cents
          paymentStatus: 'successful',
          paymentMethod: b.paymentMethod,
          duration: b.duration
        })),
        // Guide bookings
        ...guideBookings.map(b => ({
          id: `G${b.id}`,
          type: 'guide',
          userName: `User ${b.userId || 'Unknown'}`,
          guideName: `Guide ${b.guideId || 'Unknown'}`,
          destination: b.destination,
          date: b.date,
          status: b.status,
          totalAmount: parseFloat(b.totalAmount || 0),
          paymentStatus: 'successful'
        }))
      ];

      // Sort by most recent first
      allBookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      res.json(allBookings);
    } catch (error) {
      console.error("Admin bookings error:", error);
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  app.get("/api/admin/revenue", adminAuthMiddleware, async (req, res) => {
    try {
      const transactions = await storage.getAllTransactions();
      
      const revenueByMonth = transactions.reduce((acc, t) => {
        const month = new Date(t.createdAt).getMonth();
        acc[month] = (acc[month] || 0) + parseFloat(t.amount || '0');
        return acc;
      }, {});

      const revenueByService = {
        'Guide Services': transactions.filter(t => t.bookingType === 'guide').reduce((sum, t) => sum + parseFloat(t.amount || '0'), 0),
        'Hotel Bookings': transactions.filter(t => t.bookingType === 'hotel').reduce((sum, t) => sum + parseFloat(t.amount || '0'), 0),
        'Transportation': transactions.filter(t => t.bookingType === 'transport').reduce((sum, t) => sum + parseFloat(t.amount || '0'), 0)
      };

      res.json({
        monthlyRevenue: revenueByMonth,
        revenueByService
      });
    } catch (error) {
      console.error("Admin revenue error:", error);
      res.status(500).json({ error: "Failed to fetch revenue data" });
    }
  });

  app.get("/api/admin/activity", adminAuthMiddleware, async (req, res) => {
    try {
      // Mock recent activity data
      const activities = [
        { type: 'user_registration', message: 'New user registered', timestamp: new Date() },
        { type: 'booking_created', message: 'New booking created', timestamp: new Date(Date.now() - 3600000) },
        { type: 'payment_completed', message: 'Payment completed', timestamp: new Date(Date.now() - 7200000) },
        { type: 'guide_registration', message: 'New guide registered', timestamp: new Date(Date.now() - 10800000) }
      ];
      
      res.json(activities);
    } catch (error) {
      console.error("Admin activity error:", error);
      res.status(500).json({ error: "Failed to fetch activity data" });
    }
  });

  app.get("/api/admin/database/tables", adminAuthMiddleware, async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name
      `);
      res.json(result.rows);
    } catch (error) {
      console.error("Database tables error:", error);
      res.status(500).json({ error: "Failed to fetch database tables" });
    }
  });

  app.post("/api/admin/database/query", adminAuthMiddleware, async (req, res) => {
    try {
      const { query } = req.body;
      
      // Basic security check - only allow SELECT, SHOW, DESCRIBE queries
      const normalizedQuery = query.trim().toLowerCase();
      if (!normalizedQuery.startsWith('select') && 
          !normalizedQuery.startsWith('show') && 
          !normalizedQuery.startsWith('describe') &&
          !normalizedQuery.startsWith('explain')) {
        return res.status(400).json({ error: "Only SELECT, SHOW, DESCRIBE, and EXPLAIN queries are allowed" });
      }

      const result = await pool.query(query);
      res.json({
        rows: result.rows,
        rowCount: result.rowCount,
        fields: result.fields?.map(f => f.name) || []
      });
    } catch (error) {
      console.error("Query execution error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Serve admin static files
  app.use('/admin', express.static('admin'));

  const httpServer = createServer(app);

  // WebSocket server for real-time messaging
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('New WebSocket connection');
    
    ws.on('message', (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'join_booking') {
          // Associate this connection with a booking
          (ws as any).bookingId = message.bookingId;
          (ws as any).userId = message.userId;
        } else if (message.type === 'new_message') {
          // Broadcast to all clients in this booking room
          wss.clients.forEach((client: WebSocket) => {
            if (client !== ws && 
                client.readyState === WebSocket.OPEN && 
                (client as any).bookingId === message.bookingId) {
              client.send(JSON.stringify(message));
            }
          });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });

  // User notifications endpoint
  app.get("/api/user-notifications", authenticateToken, async (req, res) => {
    try {
      const notifications = await storage.getUserNotifications(req.user.id);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching user notifications:", error);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.patch("/api/user-notifications/:id/read", authenticateToken, async (req, res) => {
    try {
      await storage.markUserNotificationAsRead(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ error: "Failed to mark notification as read" });
    }
  });

  // Transport booking routes
  app.post("/api/transport-bookings", authenticateToken, async (req, res) => {

    try {
      const { bookingType, serviceDetails, amount, paymentMethod, paymentDetails } = req.body;
      
      // Generate unique transaction ID
      const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      const booking = await storage.createTransportBooking({
        userId: req.user.id,
        bookingType,
        serviceDetails,
        amount,
        paymentMethod,
        paymentDetails,
        transactionId,
        paymentStatus: "successful",
        bookingStatus: "confirmed"
      });

      res.json({ 
        success: true, 
        booking,
        transactionId: booking.transactionId 
      });
    } catch (error: any) {
      console.error("Transport booking error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to create booking: " + error.message 
      });
    }
  });

  app.get("/api/transport-bookings", authenticateToken, async (req, res) => {
    try {
      const bookings = await storage.getTransportBookingsByUser(req.user.id);
      res.json(bookings);
    } catch (error: any) {
      console.error("Get transport bookings error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to get bookings: " + error.message 
      });
    }
  });

  return httpServer;
}
