import { 
  users, 
  transactions, 
  savedPlaces, 
  hotelBookings, 
  bookedPlans, 
  transportBookings,
  tourRequests, 
  guideTours, 
  tourIdeas, 
  guideTransactions, 
  adminAnalytics, 
  adminFeedback, 
  adminAiUsage,
  guideBookings,
  guideMessages,
  guideNotifications,
  type User, 
  type InsertUser, 
  type UpdateUserGuide, 
  type ProfileCompletion,
  type Transaction, 
  type InsertTransaction, 
  type SavedPlace, 
  type InsertSavedPlace, 
  type HotelBooking, 
  type InsertHotelBooking, 
  type BookedPlan, 
  type InsertBookedPlan,
  type TransportBooking,
  type InsertTransportBooking, 
  type TourRequest, 
  type InsertTourRequest, 
  type GuideTour, 
  type InsertGuideTour, 
  type TourIdea, 
  type InsertTourIdea, 
  type GuideTransaction, 
  type InsertGuideTransaction, 
  type AdminAnalytics, 
  type InsertAdminAnalytics, 
  type AdminFeedback, 
  type InsertAdminFeedback, 
  type AdminAiUsage, 
  type InsertAdminAiUsage,
  type GuideBooking,
  type InsertGuideBooking,
  type GuideMessage,
  type InsertGuideMessage,
  type GuideNotification,
  type InsertGuideNotification,
  userNotifications,
  type UserNotification,
  type InsertUserNotification
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserBySessionToken(token: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserGuideProfile(id: number, guideData: UpdateUserGuide): Promise<User | undefined>;
  updateUserProfile(id: number, profileData: Partial<ProfileCompletion & { profileCompletionPromptShown?: boolean }>): Promise<User | undefined>;
  updateUserSession(id: number, sessionToken: string, expiryDate: Date): Promise<User | undefined>;
  updateUserLanguage(id: number, language: string): Promise<User | undefined>;
  updateUserActivity(id: number): Promise<void>;
  clearUserSession(id: number): Promise<void>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactionsByUser(userId: number): Promise<Transaction[]>;
  getTransactionById(id: number): Promise<Transaction | undefined>;
  updateTransactionStatus(id: number, status: string): Promise<Transaction | undefined>;
  getSavedPlacesByUser(userId: number): Promise<SavedPlace[]>;
  createSavedPlace(savedPlace: InsertSavedPlace): Promise<SavedPlace>;
  removeSavedPlace(userId: number, placeId: string): Promise<void>;
  isPlaceSaved(userId: number, placeId: string): Promise<boolean>;
  createHotelBooking(booking: InsertHotelBooking): Promise<HotelBooking>;
  getHotelBookingsByUser(userId: number): Promise<HotelBooking[]>;
  updateHotelBookingStatus(id: number, status: string): Promise<HotelBooking | undefined>;
  createBookedPlan(plan: InsertBookedPlan): Promise<BookedPlan>;
  getBookedPlansByUser(userId: number): Promise<BookedPlan[]>;
  getBookedPlanById(id: number): Promise<BookedPlan | undefined>;
  updateBookedPlanStatus(id: number, status: string): Promise<BookedPlan | undefined>;
  
  // Guide-specific methods
  getTourRequestsByGuide(guideId: number): Promise<TourRequest[]>;
  createTourRequest(request: InsertTourRequest): Promise<TourRequest>;
  updateTourRequestStatus(id: number, status: string): Promise<TourRequest | undefined>;
  getGuideToursByGuide(guideId: number): Promise<GuideTour[]>;
  createGuideTour(tour: InsertGuideTour): Promise<GuideTour>;
  getTourIdeasByGuide(guideId: number): Promise<TourIdea[]>;
  createTourIdea(idea: InsertTourIdea): Promise<TourIdea>;
  getGuideTransactionsByGuide(guideId: number): Promise<GuideTransaction[]>;
  createGuideTransaction(transaction: InsertGuideTransaction): Promise<GuideTransaction>;
  
  // Admin-specific methods
  getAllUsers(): Promise<User[]>;
  getUserById(id: number): Promise<User | undefined>;
  updateUser(id: number, userData: any): Promise<User | undefined>;
  deleteUser(id: number): Promise<void>;
  getAllTransactions(): Promise<Transaction[]>;
  getAllHotelBookings(): Promise<HotelBooking[]>;
  getAllBookedPlans(): Promise<BookedPlan[]>;
  getUserStats(): Promise<any>;
  getBookingStats(): Promise<any>;
  getRevenueStats(): Promise<any>;
  createAdminAnalytics(analytics: InsertAdminAnalytics): Promise<AdminAnalytics>;
  getAdminAnalytics(metricType?: string): Promise<AdminAnalytics[]>;
  createAdminFeedback(feedback: InsertAdminFeedback): Promise<AdminFeedback>;
  getAllAdminFeedback(): Promise<AdminFeedback[]>;
  updateAdminFeedbackStatus(id: number, status: string, adminNotes?: string): Promise<AdminFeedback | undefined>;
  createAdminAiUsage(usage: InsertAdminAiUsage): Promise<AdminAiUsage>;
  getAdminAiUsage(): Promise<AdminAiUsage[]>;
  getTourRequestsForAdmin(): Promise<TourRequest[]>;
  getGuideToursForAdmin(): Promise<GuideTour[]>;
  
  // Guide booking and messaging methods
  createGuideBooking(booking: InsertGuideBooking): Promise<GuideBooking>;
  getGuideBookingsByUser(userId: number): Promise<GuideBooking[]>;
  getGuideBookingsByGuide(guideId: number): Promise<GuideBooking[]>;
  updateGuideBookingStatus(id: number, status: string): Promise<GuideBooking | undefined>;
  getGuideBookingById(id: number): Promise<GuideBooking | undefined>;
  
  createGuideMessage(message: InsertGuideMessage): Promise<GuideMessage>;
  getMessagesByBooking(bookingId: number): Promise<GuideMessage[]>;
  markMessagesAsRead(bookingId: number, userId: number): Promise<void>;
  
  createGuideNotification(notification: InsertGuideNotification): Promise<GuideNotification>;
  getNotificationsByUser(userId: number): Promise<GuideNotification[]>;
  markNotificationAsRead(id: number): Promise<void>;
  getAvailableGuides(): Promise<User[]>;
  
  // User notification methods
  createUserNotification(notification: InsertUserNotification): Promise<UserNotification>;
  getUserNotifications(userId: number): Promise<UserNotification[]>;
  markUserNotificationAsRead(id: number): Promise<void>;
  
  // Transport booking methods
  createTransportBooking(booking: InsertTransportBooking): Promise<TransportBooking>;
  getTransportBookingsByUser(userId: number): Promise<TransportBooking[]>;
  getTransportBookingById(id: number): Promise<TransportBooking | undefined>;
  getAllTransportBookings(): Promise<TransportBooking[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async updateUserGuideProfile(id: number, guideData: UpdateUserGuide): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ 
        ...guideData,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async updateUserProfile(id: number, profileData: Partial<ProfileCompletion & { profileCompletionPromptShown?: boolean }>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ 
        ...profileData,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getUserBySessionToken(token: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.sessionToken, token));
    if (user && user.sessionExpiry && new Date() > user.sessionExpiry) {
      // Session expired, clear it
      await this.clearUserSession(user.id);
      return undefined;
    }
    return user || undefined;
  }

  async updateUserSession(id: number, sessionToken: string, expiryDate: Date): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ 
        sessionToken, 
        sessionExpiry: expiryDate,
        lastActiveAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async updateUserLanguage(id: number, language: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ language })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async updateUserActivity(id: number): Promise<void> {
    await db
      .update(users)
      .set({ lastActiveAt: new Date() })
      .where(eq(users.id, id));
  }

  async clearUserSession(id: number): Promise<void> {
    await db
      .update(users)
      .set({ 
        sessionToken: null, 
        sessionExpiry: null 
      })
      .where(eq(users.id, id));
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values(insertTransaction)
      .returning();
    return transaction;
  }

  async getTransactionsByUser(userId: number): Promise<Transaction[]> {
    return await db.select().from(transactions).where(eq(transactions.userId, userId));
  }

  async getTransactionById(id: number): Promise<Transaction | undefined> {
    const [transaction] = await db.select().from(transactions).where(eq(transactions.id, id));
    return transaction || undefined;
  }

  async updateTransactionStatus(id: number, status: string): Promise<Transaction | undefined> {
    const [transaction] = await db
      .update(transactions)
      .set({ paymentStatus: status })
      .where(eq(transactions.id, id))
      .returning();
    return transaction || undefined;
  }

  async getSavedPlacesByUser(userId: number): Promise<SavedPlace[]> {
    return await db.select().from(savedPlaces).where(eq(savedPlaces.userId, userId));
  }

  async createSavedPlace(insertSavedPlace: InsertSavedPlace): Promise<SavedPlace> {
    const [savedPlace] = await db
      .insert(savedPlaces)
      .values(insertSavedPlace)
      .returning();
    return savedPlace;
  }

  async removeSavedPlace(userId: number, placeId: string): Promise<void> {
    await db
      .delete(savedPlaces)
      .where(and(eq(savedPlaces.userId, userId), eq(savedPlaces.placeId, placeId)));
  }

  async isPlaceSaved(userId: number, placeId: string): Promise<boolean> {
    const [place] = await db
      .select()
      .from(savedPlaces)
      .where(and(eq(savedPlaces.userId, userId), eq(savedPlaces.placeId, placeId)));
    return !!place;
  }

  async createHotelBooking(insertBooking: InsertHotelBooking): Promise<HotelBooking> {
    const [booking] = await db
      .insert(hotelBookings)
      .values(insertBooking)
      .returning();
    return booking;
  }

  async getHotelBookingsByUser(userId: number): Promise<HotelBooking[]> {
    return await db.select().from(hotelBookings).where(eq(hotelBookings.userId, userId));
  }

  async updateHotelBookingStatus(id: number, status: string): Promise<HotelBooking | undefined> {
    const [booking] = await db
      .update(hotelBookings)
      .set({ bookingStatus: status })
      .where(eq(hotelBookings.id, id))
      .returning();
    return booking || undefined;
  }

  async createBookedPlan(insertPlan: InsertBookedPlan): Promise<BookedPlan> {
    const [plan] = await db
      .insert(bookedPlans)
      .values(insertPlan)
      .returning();
    return plan;
  }

  async getBookedPlansByUser(userId: number): Promise<BookedPlan[]> {
    return await db
      .select()
      .from(bookedPlans)
      .where(eq(bookedPlans.userId, userId))
      .orderBy(bookedPlans.createdAt);
  }

  async getBookedPlanById(id: number): Promise<BookedPlan | undefined> {
    const [plan] = await db
      .select()
      .from(bookedPlans)
      .where(eq(bookedPlans.id, id));
    return plan;
  }

  async updateBookedPlanStatus(id: number, status: string): Promise<BookedPlan | undefined> {
    const [plan] = await db
      .update(bookedPlans)
      .set({ bookingStatus: status, updatedAt: new Date() })
      .where(eq(bookedPlans.id, id))
      .returning();
    return plan;
  }

  // Guide-specific methods implementation
  async getTourRequestsByGuide(guideId: number): Promise<TourRequest[]> {
    return await db.select().from(tourRequests).where(eq(tourRequests.guideId, guideId));
  }

  async createTourRequest(insertRequest: InsertTourRequest): Promise<TourRequest> {
    const [request] = await db
      .insert(tourRequests)
      .values(insertRequest)
      .returning();
    return request;
  }

  async updateTourRequestStatus(id: number, status: string): Promise<TourRequest | undefined> {
    const [request] = await db
      .update(tourRequests)
      .set({ 
        status,
        updatedAt: new Date()
      })
      .where(eq(tourRequests.id, id))
      .returning();
    return request || undefined;
  }

  async getGuideToursByGuide(guideId: number): Promise<GuideTour[]> {
    return await db.select().from(guideTours).where(eq(guideTours.guideId, guideId));
  }

  async createGuideTour(insertTour: InsertGuideTour): Promise<GuideTour> {
    const [tour] = await db
      .insert(guideTours)
      .values(insertTour)
      .returning();
    return tour;
  }

  async getTourIdeasByGuide(guideId: number): Promise<TourIdea[]> {
    return await db.select().from(tourIdeas).where(eq(tourIdeas.guideId, guideId));
  }

  async createTourIdea(insertIdea: InsertTourIdea): Promise<TourIdea> {
    const [idea] = await db
      .insert(tourIdeas)
      .values(insertIdea)
      .returning();
    return idea;
  }

  async getGuideTransactionsByGuide(guideId: number): Promise<GuideTransaction[]> {
    return await db.select().from(guideTransactions).where(eq(guideTransactions.guideId, guideId));
  }

  async createGuideTransaction(insertTransaction: InsertGuideTransaction): Promise<GuideTransaction> {
    const [transaction] = await db
      .insert(guideTransactions)
      .values(insertTransaction)
      .returning();
    return transaction;
  }

  // Admin-specific methods implementation
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(users.createdAt);
  }

  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async updateUser(id: number, userData: any): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ 
        ...userData,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return await db.select().from(transactions).orderBy(transactions.createdAt);
  }

  async getAllHotelBookings(): Promise<HotelBooking[]> {
    return await db.select().from(hotelBookings).orderBy(hotelBookings.createdAt);
  }

  async getAllBookedPlans(): Promise<BookedPlan[]> {
    return await db.select().from(bookedPlans).orderBy(bookedPlans.createdAt);
  }

  async getUserStats(): Promise<any> {
    const totalUsers = await db.select({ count: users.id }).from(users);
    const activeUsers = await db.select({ count: users.id }).from(users).where(eq(users.lastActiveAt, new Date()));
    const guides = await db.select({ count: users.id }).from(users).where(eq(users.role, 'guide'));
    const regularUsers = await db.select({ count: users.id }).from(users).where(eq(users.role, 'user'));
    
    return {
      totalUsers: totalUsers.length,
      activeUsers: activeUsers.length,
      guides: guides.length,
      regularUsers: regularUsers.length
    };
  }

  async getBookingStats(): Promise<any> {
    const totalBookings = await db.select({ count: hotelBookings.id }).from(hotelBookings);
    const confirmedBookings = await db.select({ count: hotelBookings.id }).from(hotelBookings).where(eq(hotelBookings.bookingStatus, 'confirmed'));
    const pendingBookings = await db.select({ count: hotelBookings.id }).from(hotelBookings).where(eq(hotelBookings.bookingStatus, 'pending'));
    const totalPlans = await db.select({ count: bookedPlans.id }).from(bookedPlans);
    
    return {
      totalBookings: totalBookings.length,
      confirmedBookings: confirmedBookings.length,
      pendingBookings: pendingBookings.length,
      totalPlans: totalPlans.length
    };
  }

  async getRevenueStats(): Promise<any> {
    const transactionData = await db.select().from(transactions);
    const hotelBookingData = await db.select().from(hotelBookings);
    const guideTransactionData = await db.select().from(guideTransactions);
    
    const totalTransactionRevenue = transactionData.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const totalHotelRevenue = hotelBookingData.reduce((sum, h) => sum + (h.totalAmount / 100), 0);
    const totalGuideRevenue = guideTransactionData.reduce((sum, g) => sum + parseFloat(g.amount), 0);
    
    return {
      totalRevenue: totalTransactionRevenue + totalHotelRevenue + totalGuideRevenue,
      transactionRevenue: totalTransactionRevenue,
      hotelRevenue: totalHotelRevenue,
      guideRevenue: totalGuideRevenue
    };
  }

  async createAdminAnalytics(insertAnalytics: InsertAdminAnalytics): Promise<AdminAnalytics> {
    const [analytics] = await db
      .insert(adminAnalytics)
      .values(insertAnalytics)
      .returning();
    return analytics;
  }

  async getAdminAnalytics(metricType?: string): Promise<AdminAnalytics[]> {
    if (metricType) {
      return await db.select().from(adminAnalytics).where(eq(adminAnalytics.metricType, metricType)).orderBy(adminAnalytics.recordDate);
    }
    return await db.select().from(adminAnalytics).orderBy(adminAnalytics.recordDate);
  }

  async createAdminFeedback(insertFeedback: InsertAdminFeedback): Promise<AdminFeedback> {
    const [feedback] = await db
      .insert(adminFeedback)
      .values(insertFeedback)
      .returning();
    return feedback;
  }

  async getAllAdminFeedback(): Promise<AdminFeedback[]> {
    return await db.select().from(adminFeedback).orderBy(adminFeedback.createdAt);
  }

  async updateAdminFeedbackStatus(id: number, status: string, adminNotes?: string): Promise<AdminFeedback | undefined> {
    const [feedback] = await db
      .update(adminFeedback)
      .set({ 
        status,
        adminNotes: adminNotes || null,
        updatedAt: new Date()
      })
      .where(eq(adminFeedback.id, id))
      .returning();
    return feedback || undefined;
  }

  async createAdminAiUsage(insertUsage: InsertAdminAiUsage): Promise<AdminAiUsage> {
    const [usage] = await db
      .insert(adminAiUsage)
      .values(insertUsage)
      .returning();
    return usage;
  }

  async getAdminAiUsage(): Promise<AdminAiUsage[]> {
    return await db.select().from(adminAiUsage).orderBy(adminAiUsage.createdAt);
  }

  async getTourRequestsForAdmin(): Promise<TourRequest[]> {
    return await db.select().from(tourRequests).orderBy(tourRequests.createdAt);
  }

  async getGuideToursForAdmin(): Promise<GuideTour[]> {
    return await db.select().from(guideTours).orderBy(guideTours.createdAt);
  }

  // Guide booking and messaging methods implementation
  async createGuideBooking(insertBooking: InsertGuideBooking): Promise<GuideBooking> {
    const [booking] = await db
      .insert(guideBookings)
      .values(insertBooking)
      .returning();
    return booking;
  }

  async getGuideBookingsByUser(userId: number): Promise<GuideBooking[]> {
    return await db.select().from(guideBookings).where(eq(guideBookings.userId, userId));
  }

  async getGuideBookingsByGuide(guideId: number): Promise<GuideBooking[]> {
    return await db.select().from(guideBookings).where(eq(guideBookings.guideId, guideId));
  }

  async updateGuideBookingStatus(id: number, status: string): Promise<GuideBooking | undefined> {
    const [booking] = await db
      .update(guideBookings)
      .set({ status, updatedAt: new Date() })
      .where(eq(guideBookings.id, id))
      .returning();
    return booking || undefined;
  }

  async getGuideBookingById(id: number): Promise<GuideBooking | undefined> {
    const [booking] = await db.select().from(guideBookings).where(eq(guideBookings.id, id));
    return booking || undefined;
  }

  async createGuideMessage(insertMessage: InsertGuideMessage): Promise<GuideMessage> {
    const [message] = await db
      .insert(guideMessages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getMessagesByBooking(bookingId: number): Promise<GuideMessage[]> {
    return await db.select().from(guideMessages).where(eq(guideMessages.bookingId, bookingId));
  }

  async markMessagesAsRead(bookingId: number, userId: number): Promise<void> {
    await db
      .update(guideMessages)
      .set({ isRead: true })
      .where(
        and(
          eq(guideMessages.bookingId, bookingId),
          eq(guideMessages.senderId, userId)
        )
      );
  }

  async createGuideNotification(insertNotification: InsertGuideNotification): Promise<GuideNotification> {
    const [notification] = await db
      .insert(guideNotifications)
      .values(insertNotification)
      .returning();
    return notification;
  }

  async getNotificationsByUser(userId: number): Promise<GuideNotification[]> {
    return await db.select().from(guideNotifications).where(eq(guideNotifications.userId, userId));
  }

  async markNotificationAsRead(id: number): Promise<void> {
    await db
      .update(guideNotifications)
      .set({ isRead: true })
      .where(eq(guideNotifications.id, id));
  }

  async getAvailableGuides(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, 'guide'));
  }

  async createUserNotification(insertNotification: InsertUserNotification): Promise<UserNotification> {
    const [notification] = await db
      .insert(userNotifications)
      .values(insertNotification)
      .returning();
    return notification;
  }

  async getUserNotifications(userId: number): Promise<UserNotification[]> {
    return await db.select().from(userNotifications)
      .where(eq(userNotifications.userId, userId))
      .orderBy(desc(userNotifications.createdAt));
  }

  async markUserNotificationAsRead(id: number): Promise<void> {
    await db.update(userNotifications)
      .set({ isRead: true })
      .where(eq(userNotifications.id, id));
  }

  async createTransportBooking(insertBooking: InsertTransportBooking): Promise<TransportBooking> {
    const [booking] = await db
      .insert(transportBookings)
      .values(insertBooking)
      .returning();
    return booking;
  }

  async getTransportBookingsByUser(userId: number): Promise<TransportBooking[]> {
    return await db
      .select()
      .from(transportBookings)
      .where(eq(transportBookings.userId, userId))
      .orderBy(desc(transportBookings.createdAt));
  }

  async getTransportBookingById(id: number): Promise<TransportBooking | undefined> {
    const [booking] = await db
      .select()
      .from(transportBookings)
      .where(eq(transportBookings.id, id));
    return booking || undefined;
  }

  async getAllTransportBookings(): Promise<TransportBooking[]> {
    return await db
      .select()
      .from(transportBookings)
      .orderBy(desc(transportBookings.createdAt));
  }

  async getAllBookedPlans(): Promise<BookedPlan[]> {
    return await db
      .select()
      .from(bookedPlans)
      .orderBy(desc(bookedPlans.createdAt));
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private transactions: Map<number, Transaction>;
  private savedPlaces: Map<number, SavedPlace>;
  private hotelBookings: Map<number, HotelBooking>;
  private bookedPlans: Map<number, BookedPlan>;
  currentId: number;
  currentTransactionId: number;
  currentSavedPlaceId: number;
  currentHotelBookingId: number;
  currentBookedPlanId: number;

  constructor() {
    this.users = new Map();
    this.transactions = new Map();
    this.savedPlaces = new Map();
    this.hotelBookings = new Map();
    this.bookedPlans = new Map();
    this.currentId = 1;
    this.currentTransactionId = 1;
    this.currentSavedPlaceId = 1;
    this.currentHotelBookingId = 1;
    this.currentBookedPlanId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id,
      sessionToken: null,
      sessionExpiry: null,
      language: "en",
      lastActiveAt: new Date(),
      isRegistrationComplete: true,
      // Profile completion fields
      phone: null,
      dateOfBirth: null,
      countryOfResidence: null,
      preferredDestinations: null,
      travelStyle: null,
      travelFrequency: null,
      passportCountry: null,
      emergencyContact: null,
      dietaryPreferences: null,
      profileCompletionPromptShown: false,
      // Guide-specific fields
      bio: null,
      experience: null,
      certification: null,
      hourlyRate: null,
      serviceAreas: null,
      languages: null,
      tourInterests: null,
      profileImageUrl: null,
      rating: "0",
      totalReviews: 0,
      totalEarnings: "0",
      completedTours: 0,
      profileCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getUserBySessionToken(token: string): Promise<User | undefined> {
    const userEntries = Array.from(this.users.values());
    for (const user of userEntries) {
      if (user.sessionToken === token) {
        if (user.sessionExpiry && new Date() > user.sessionExpiry) {
          // Session expired, clear it
          await this.clearUserSession(user.id);
          return undefined;
        }
        return user;
      }
    }
    return undefined;
  }

  async updateUserSession(id: number, sessionToken: string, expiryDate: Date): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { 
        ...user, 
        sessionToken, 
        sessionExpiry: expiryDate,
        lastActiveAt: new Date()
      };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  async updateUserLanguage(id: number, language: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { ...user, language };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  async updateUserActivity(id: number): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { ...user, lastActiveAt: new Date() };
      this.users.set(id, updatedUser);
    }
  }

  async clearUserSession(id: number): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { 
        ...user, 
        sessionToken: null, 
        sessionExpiry: null 
      };
      this.users.set(id, updatedUser);
    }
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const now = new Date();
    const transaction: Transaction = { 
      ...insertTransaction, 
      id, 
      userId: insertTransaction.userId || null,
      createdAt: now 
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async getTransactionsByUser(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.userId === userId,
    );
  }

  async getTransactionById(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async updateTransactionStatus(id: number, status: string): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (transaction) {
      transaction.paymentStatus = status;
      this.transactions.set(id, transaction);
      return transaction;
    }
    return undefined;
  }

  async getSavedPlacesByUser(userId: number): Promise<SavedPlace[]> {
    return Array.from(this.savedPlaces.values()).filter(
      (place) => place.userId === userId,
    );
  }

  async createSavedPlace(insertSavedPlace: InsertSavedPlace): Promise<SavedPlace> {
    const id = this.currentSavedPlaceId++;
    const now = new Date();
    const savedPlace: SavedPlace = { 
      ...insertSavedPlace, 
      id,
      createdAt: now 
    };
    this.savedPlaces.set(id, savedPlace);
    return savedPlace;
  }

  async removeSavedPlace(userId: number, placeId: string): Promise<void> {
    const entries = Array.from(this.savedPlaces.entries());
    for (const [key, place] of entries) {
      if (place.userId === userId && place.placeId === placeId) {
        this.savedPlaces.delete(key);
        break;
      }
    }
  }

  async isPlaceSaved(userId: number, placeId: string): Promise<boolean> {
    return Array.from(this.savedPlaces.values()).some(
      (place) => place.userId === userId && place.placeId === placeId,
    );
  }

  async createHotelBooking(insertBooking: InsertHotelBooking): Promise<HotelBooking> {
    const id = this.currentId++;
    const booking: HotelBooking = { 
      ...insertBooking,
      budgetLimit: insertBooking.budgetLimit || null,
      id,
      bookingStatus: "pending",
      paymentStatus: "pending",
      transactionId: null,
      createdAt: new Date()
    };
    return booking;
  }

  async getHotelBookingsByUser(userId: number): Promise<HotelBooking[]> {
    return [];
  }

  async updateHotelBookingStatus(id: number, status: string): Promise<HotelBooking | undefined> {
    return undefined;
  }

  async createBookedPlan(insertPlan: InsertBookedPlan): Promise<BookedPlan> {
    const id = this.currentBookedPlanId++;
    const plan: BookedPlan = { 
      ...insertPlan, 
      id,
      bookingStatus: 'confirmed',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.bookedPlans.set(id, plan);
    return plan;
  }

  async getBookedPlansByUser(userId: number): Promise<BookedPlan[]> {
    return Array.from(this.bookedPlans.values()).filter(
      (plan) => plan.userId === userId,
    );
  }

  async getBookedPlanById(id: number): Promise<BookedPlan | undefined> {
    return this.bookedPlans.get(id);
  }

  async updateBookedPlanStatus(id: number, status: string): Promise<BookedPlan | undefined> {
    const plan = this.bookedPlans.get(id);
    if (plan) {
      plan.bookingStatus = status;
      plan.updatedAt = new Date();
      this.bookedPlans.set(id, plan);
      return plan;
    }
    return undefined;
  }

  // Implement all missing methods from IStorage interface
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async updateUserGuideProfile(id: number, guideData: UpdateUserGuide): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { ...user, ...guideData, updatedAt: new Date() };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  async updateUserProfile(id: number, profileData: Partial<ProfileCompletion & { profileCompletionPromptShown?: boolean }>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { ...user, ...profileData, updatedAt: new Date() };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  // Guide-specific methods (returning empty arrays/undefined for MemStorage)
  async getTourRequestsByGuide(guideId: number): Promise<TourRequest[]> { return []; }
  async createTourRequest(request: InsertTourRequest): Promise<TourRequest> { 
    return { 
      ...request, 
      id: 1, 
      status: "pending", 
      message: request.message || null,
      travelerEmail: request.travelerEmail || null,
      timeAgo: request.timeAgo || null,
      createdAt: new Date(), 
      updatedAt: new Date() 
    }; 
  }
  async updateTourRequestStatus(id: number, status: string): Promise<TourRequest | undefined> { return undefined; }
  async getGuideToursByGuide(guideId: number): Promise<GuideTour[]> { return []; }
  async createGuideTour(tour: InsertGuideTour): Promise<GuideTour> { 
    return { 
      ...tour, 
      id: 1, 
      status: "active", 
      description: tour.description || null,
      difficulty: tour.difficulty || null,
      highlights: tour.highlights || null,
      maxParticipants: tour.maxParticipants || null,
      createdAt: new Date(), 
      updatedAt: new Date() 
    }; 
  }
  async getTourIdeasByGuide(guideId: number): Promise<TourIdea[]> { return []; }
  async createTourIdea(idea: InsertTourIdea): Promise<TourIdea> { 
    return { 
      ...idea, 
      id: 1, 
      duration: idea.duration || null,
      description: idea.description || null,
      difficulty: idea.difficulty || null,
      highlights: idea.highlights || null,
      suggestedPrice: idea.suggestedPrice || null,
      prompt: idea.prompt || null,
      createdAt: new Date() 
    }; 
  }
  async getGuideTransactionsByGuide(guideId: number): Promise<GuideTransaction[]> { return []; }
  async createGuideTransaction(transaction: InsertGuideTransaction): Promise<GuideTransaction> { 
    return { 
      ...transaction, 
      id: 1, 
      status: "completed",
      paymentMethod: transaction.paymentMethod || null,
      tourRequestId: transaction.tourRequestId || null,
      createdAt: new Date() 
    }; 
  }

  // Admin-specific methods
  async getAllUsers(): Promise<User[]> { return Array.from(this.users.values()); }
  async getAllTransactions(): Promise<Transaction[]> { return Array.from(this.transactions.values()); }
  async getAllHotelBookings(): Promise<HotelBooking[]> { return Array.from(this.hotelBookings.values()); }
  async getAllBookedPlans(): Promise<BookedPlan[]> { return Array.from(this.bookedPlans.values()); }
  async getUserStats(): Promise<any> { return { totalUsers: this.users.size }; }
  async getBookingStats(): Promise<any> { return { totalBookings: this.hotelBookings.size }; }
  async getRevenueStats(): Promise<any> { return { totalRevenue: 0 }; }
  async createAdminAnalytics(analytics: InsertAdminAnalytics): Promise<AdminAnalytics> { 
    return { 
      ...analytics, 
      id: 1, 
      metricData: analytics.metricData || null,
      recordDate: analytics.recordDate || new Date(),
      createdAt: new Date() 
    }; 
  }
  async getAdminAnalytics(metricType?: string): Promise<AdminAnalytics[]> { return []; }
  async createAdminFeedback(feedback: InsertAdminFeedback): Promise<AdminFeedback> { 
    return { 
      ...feedback, 
      id: 1, 
      status: feedback.status || "pending", 
      userId: feedback.userId || null,
      guideId: feedback.guideId || null,
      feedbackText: feedback.feedbackText || null,
      tripId: feedback.tripId || null,
      adminNotes: feedback.adminNotes || null,
      createdAt: new Date(), 
      updatedAt: new Date() 
    }; 
  }
  async getAllAdminFeedback(): Promise<AdminFeedback[]> { return []; }
  async updateAdminFeedbackStatus(id: number, status: string, adminNotes?: string): Promise<AdminFeedback | undefined> { return undefined; }
  async createAdminAiUsage(usage: InsertAdminAiUsage): Promise<AdminAiUsage> { 
    return { 
      ...usage, 
      id: 1, 
      userId: usage.userId || null,
      tokensUsed: usage.tokensUsed || null,
      responseTime: usage.responseTime || null,
      success: usage.success || null,
      errorMessage: usage.errorMessage || null,
      requestData: usage.requestData || null,
      responseData: usage.responseData || null,
      createdAt: new Date() 
    }; 
  }
  async getAdminAiUsage(): Promise<AdminAiUsage[]> { return []; }
  async getTourRequestsForAdmin(): Promise<TourRequest[]> { return []; }
  async getGuideToursForAdmin(): Promise<GuideTour[]> { return []; }

  // Guide booking and messaging methods
  async createGuideBooking(booking: InsertGuideBooking): Promise<GuideBooking> { 
    return { 
      ...booking, 
      id: 1, 
      status: "pending", 
      totalAmount: booking.totalAmount || null,
      specialRequests: booking.specialRequests || null,
      createdAt: new Date(), 
      updatedAt: new Date() 
    }; 
  }
  async getGuideBookingsByUser(userId: number): Promise<GuideBooking[]> { return []; }
  async getGuideBookingsByGuide(guideId: number): Promise<GuideBooking[]> { return []; }
  async updateGuideBookingStatus(id: number, status: string): Promise<GuideBooking | undefined> { return undefined; }
  async getGuideBookingById(id: number): Promise<GuideBooking | undefined> { return undefined; }
  
  async createGuideMessage(message: InsertGuideMessage): Promise<GuideMessage> { 
    return { 
      ...message, 
      id: 1, 
      messageType: message.messageType || null,
      isRead: false,
      createdAt: new Date() 
    }; 
  }
  async getMessagesByBooking(bookingId: number): Promise<GuideMessage[]> { return []; }
  async markMessagesAsRead(bookingId: number, userId: number): Promise<void> { }
  
  async createGuideNotification(notification: InsertGuideNotification): Promise<GuideNotification> { 
    return { 
      ...notification, 
      id: 1, 
      isRead: false,
      relatedId: notification.relatedId || null,
      createdAt: new Date() 
    }; 
  }
  async getNotificationsByUser(userId: number): Promise<GuideNotification[]> { return []; }
  async markNotificationAsRead(id: number): Promise<void> { }
  async getAvailableGuides(): Promise<User[]> { 
    return Array.from(this.users.values()).filter(user => user.role === 'guide'); 
  }
  
  // User notification methods
  async createUserNotification(notification: InsertUserNotification): Promise<UserNotification> { 
    return { 
      ...notification, 
      id: 1, 
      isRead: false,
      relatedId: notification.relatedId || null,
      createdAt: new Date() 
    }; 
  }
  async getUserNotifications(userId: number): Promise<UserNotification[]> { return []; }
  async markUserNotificationAsRead(id: number): Promise<void> { }
  
  // Transport booking methods
  async createTransportBooking(booking: InsertTransportBooking): Promise<TransportBooking> { 
    return { ...booking, id: 1, paymentStatus: booking.paymentStatus || "successful", bookingStatus: booking.bookingStatus || "confirmed", createdAt: new Date(), updatedAt: new Date() }; 
  }
  async getTransportBookingsByUser(userId: number): Promise<TransportBooking[]> { return []; }
  async getTransportBookingById(id: number): Promise<TransportBooking | undefined> { return undefined; }
  async getAllTransportBookings(): Promise<TransportBooking[]> { return []; }
}

export const storage = new DatabaseStorage();
