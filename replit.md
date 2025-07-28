# Pack Your Bags - AI Travel Companion

## Overview

Pack Your Bags is a full-stack web application designed as an AI-powered travel planning and booking platform. The application provides users with intelligent trip planning, local guide services, translation capabilities, and booking assistance through a modern, responsive interface.

**Recent Migration**: Successfully migrated from Lovable to Replit environment (January 11, 2025), including routing updates from react-router-dom to wouter and implementation of comprehensive navigation system with dedicated pages for all main features.

**Authentication System Implementation**: Successfully implemented complete authentication system (January 11, 2025) with secure session management, password hashing with bcrypt, token-based authentication lasting 30 days, registration/login API endpoints, React context integration, and database storage of user credentials and sessions. Fixed all authentication flow issues including modal handling and form state management.

**Transportation Booking System**: Implemented comprehensive transportation booking mechanism with PostgreSQL database integration (January 11, 2025), including detailed transport selection, payment processing, and transaction tracking.

**Video Hover Functionality & Saved Places**: Added interactive video playback on hover for travel destination videos with Pexels video integration (January 11, 2025). Implemented saved places feature with heart button functionality, allowing users to save favorite destinations to their profile with full database persistence.

**Hotel Booking System**: Implemented comprehensive hotel booking flow integrated with transportation booking (January 11, 2025), including hotel selection with room types, budget validation warnings, check-in/out date selection, payment processing with multiple payment methods, and transaction status tracking. Added hotelBookings table to PostgreSQL schema with complete CRUD operations.

**Payment System & Budget Allocation**: Implemented guaranteed successful payments across all payment components (January 11, 2025), ensuring 100% payment success rate in TransportPayment, PaymentPage, HotelPayment, and TripPaymentDetails components. Added intelligent budget-based hotel cost allocation system that automatically adjusts spending percentages based on user budget ranges - luxury travel (55% hotel, 30% transport, 15% activities), premium travel (50% hotel, 32% transport, 18% activities), mid-range travel (45% hotel, 35% transport, 20% activities), and budget travel (40% hotel, 40% transport, 20% activities). Enhanced FinalPlanPage to display budget breakdown with percentage allocations and smart allocation information.

**Final Plan Flow Optimization**: Centralized "View Final Plan" button to TripPaymentStatus page only (January 11, 2025), removing duplicate buttons from BookingFlow step 4 and PaymentStatus components. Updated TripPaymentStatus to force all payment results to show as "successful" and provide direct navigation to the final plan page. Streamlined user flow to ensure consistent experience where final plan access is only available after complete payment processing.

**Network Error Resolution**: Fixed comprehensive "Failed to fetch" errors across the application (January 11, 2025) by updating queryClient configuration, replacing all direct fetch calls with centralized apiRequest function, and adding global error handlers to prevent unhandled promise rejections. Enhanced error handling with proper try-catch blocks and improved QueryClient with better retry logic.

**Navigation Optimization**: Refined BookingFlow navigation system (January 11, 2025) to show Next button only on Step 1 (Plan Selection), allowing users to navigate to transport booking. After transport booking completion, individual components handle progression while maintaining Previous button functionality for backward navigation.

**Final Plan Routing Fix**: Resolved critical routing issue with "View Final Plan" button (January 11, 2025) where clicking after payment completion was redirecting to hotel booking step instead of final plan. Implemented localStorage flag system to properly detect and show final plan modal with budget calculations and travel summary. The flow now correctly proceeds from payment completion to final plan review without requiring users to repeat payment steps.

**Destination Search Enhancement**: Implemented intelligent location search suggestions in SmartTripPlanner (January 11, 2025) with comprehensive autocomplete functionality. Added 200+ popular worldwide destinations with real-time filtering, dropdown suggestions, and intuitive click-to-select interface. Users can now type partial destination names (e.g., "par" for "Paris, France") and get instant, relevant location suggestions for improved user experience and reduced typing errors.

**Unified Authentication System**: Implemented comprehensive role-based authentication system (January 12, 2025) with unified AuthPage supporting User/Local Guide role selection, login/signup toggle, localStorage-based user database simulation, role-based redirection to appropriate dashboards, GuideRegistration component for detailed guide profile completion with service areas/languages/specializations, GuideDashboard with tour request management/AI idea generator/earnings tracking, UserDashboard with trip history/saved places/booking management, and complete integration with existing travel planning features while maintaining backward compatibility.

**Database Authentication Migration**: Successfully migrated from localStorage to PostgreSQL database authentication (January 12, 2025) with enhanced user schema supporting email/name fields, role-based access (user/guide), complete guide profile data (bio, phone, experience, certification, hourly rate, service areas, languages, tour interests), session token management with 30-day expiry, password hashing with bcrypt, comprehensive API endpoints (/api/auth/signup, /api/auth/signin, /api/auth/me, /api/auth/logout, /api/auth/complete-guide-profile), automatic session validation on app load, and seamless back button functionality in GuideRegistration to preserve entered details. Authentication now persists across browser sessions without repeated login prompts.

**Local Guide Dashboard Database Integration**: Completed comprehensive database implementation for Local Guide dashboard (January 12, 2025) with 4 new PostgreSQL tables: tourRequests (traveler booking requests with detailed information), guideTours (active tour offerings with pricing and descriptions), tourIdeas (AI-generated tour suggestions with highlights), and guideTransactions (complete financial transaction history). Enhanced storage layer with guide-specific CRUD operations, populated tables with realistic sample data for testing, and ensured all dashboard tabs (Overview, Requests, Tours, AI Ideas, Profile) now display functional content from the database. Dashboard provides real-time data integration with live stats, transaction management, and comprehensive business analytics for Local Guides.

**Admin Dashboard Implementation**: Created comprehensive Admin Dashboard system (January 12, 2025) with full PostgreSQL integration using existing database architecture instead of MongoDB. Implemented 3 admin-specific tables: adminAnalytics (platform metrics and KPIs), adminFeedback (user feedback management with rating system), and adminAiUsage (AI service monitoring with token tracking). Built AdminDashboard.tsx with 6 management panels: Overview (key stats and platform health), Users (user management with role-based filtering), Bookings (hotel booking oversight), Feedback (customer feedback review system), AI Usage (AI service analytics), and Tours (tour request monitoring). Added role-based authentication with admin middleware, comprehensive API endpoints for all admin functions, and populated sample data for testing. Admin access: admin@packyourbags.com / admin123. Dashboard provides complete platform oversight with real-time data, user management capabilities, and business intelligence analytics.

**Enhanced Profile Completion System**: Upgraded ProfileCompletionModal (January 13, 2025) with complete UI structure from ProfileEdit.tsx featuring comprehensive form sections (Contact Information, Location Information, Travel Preferences), all profile fields (phone, date of birth, emergency contact, countries, travel style/frequency, preferred destinations, dietary preferences), enhanced visual design with Card layout and gradient buttons, "Maybe Later" button functionality that marks prompt as shown and closes modal, improved stability with proper API request handling, debug logging for profile completion detection, and automatic page refresh after completion to ensure state consistency. System now appears immediately after signup with stable functionality across login/logout cycles.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with a React frontend and Express.js backend, utilizing TypeScript throughout. The architecture is designed for scalability with a clear separation between client and server components.

### Directory Structure
- `client/` - React frontend application
- `server/` - Express.js backend API
- `shared/` - Common schemas and types shared between frontend and backend
- `migrations/` - Database migration files

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom travel-themed design system
- **State Management**: React Query (@tanstack/react-query) for server state
- **Routing**: Wouter for lightweight client-side navigation (migrated from react-router-dom)
- **Forms**: React Hook Form with Zod validation
- **Navigation**: Side drawer menu system with dedicated pages for user features

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Management**: Express sessions with PostgreSQL store
- **Development**: Hot reload with Vite middleware integration

### UI Component System
- Comprehensive component library based on Radix UI
- Custom travel-themed design with gradient color schemes
- Responsive design with mobile-first approach
- Glass morphism effects and modern visual styling

## Data Flow

### Database Schema
The application uses PostgreSQL with the following tables:
- Users table with username and password fields for authentication
- Transactions table for storing booking payments and transaction history
- SavedPlaces table for user's favorite destinations with heart functionality
- HotelBookings table for hotel reservations with budget limits and payment tracking
- Extensible schema structure for future travel-related entities

### Storage Layer
- **Production**: PostgreSQL database with Drizzle ORM
- **Development**: In-memory storage implementation for rapid prototyping
- **Interface**: Abstract storage interface enabling easy switching between implementations
- **Transaction Management**: Complete CRUD operations for booking transactions and payment history

### Authentication Flow
- Modal-based authentication system
- Session-based user management
- Protected routes requiring authentication for core features

### Feature Integration
1. **Smart Trip Planner**: AI-powered itinerary generation with customizable preferences
2. **Local Guide Services**: Personalized recommendations and local insights
3. **Real-time Translation**: Multi-language support with voice and text input
4. **Comprehensive Transportation Booking**: Full 5-step booking flow with:
   - Transport mode selection (Flight, Train, Bus, Car Rental)
   - Detailed booking options with ratings, comfort levels, and amenities
   - Multi-payment method processing (Credit/Debit Card, Digital Wallet, Bank Transfer, UPI)
   - Real-time payment status tracking with database integration
   - Transaction history with filtering and search capabilities
5. **Complete Hotel Booking System**: Integrated hotel booking following transportation:
   - Hotel selection with multiple properties and room types
   - Budget validation with real-time warnings when limits exceeded
   - Room type selection with pricing and amenities
   - Check-in/check-out date selection with validation
   - Multi-step payment flow with payment method selection
   - Payment status tracking (successful/pending/unsuccessful)
   - Database integration with hotelBookings table for booking persistence
6. **User Account System**: Complete navigation system with dedicated pages for:
   - Booked Plans (trip management and cancellation)
   - Transactions (payment history and details with database integration)
   - Saved Places (favorite destinations)
   - Trip History (completed travel records)
   - Profile (user information and travel preferences)
   - Settings (theme toggle and language selection)

## External Dependencies

### Core Dependencies
- **UI Components**: @radix-ui/* for accessible component primitives
- **Styling**: Tailwind CSS with PostCSS for utility-first styling
- **Database**: Drizzle ORM with PostgreSQL dialect
- **Validation**: Zod for schema validation and type safety
- **Date Handling**: date-fns for date manipulation
- **Icons**: Lucide React for consistent iconography

### Development Tools
- **TypeScript**: Strict type checking across the entire codebase
- **Vite**: Fast build tool with hot module replacement
- **ESBuild**: Fast JavaScript bundler for production builds
- **Replit Integration**: Specialized plugins for Replit development environment

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: ESBuild compiles TypeScript server code to `dist/`
- **Database**: Drizzle Kit handles schema migrations and database pushes

### Environment Configuration
- **Development**: NODE_ENV=development with Vite dev server
- **Production**: NODE_ENV=production with static file serving
- **Database**: PostgreSQL connection via DATABASE_URL environment variable

### Production Architecture
- Express server serves both API routes and static frontend assets
- Database migrations managed through Drizzle Kit
- Error handling with custom error middleware
- Request logging for API endpoints

### Scalability Considerations
- Modular component architecture allows for easy feature additions
- Abstract storage interface enables database switching
- TypeScript ensures type safety across client-server boundaries
- React Query provides efficient caching and synchronization