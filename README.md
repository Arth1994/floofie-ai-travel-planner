# 🐼 Floofie Funventures - AI Travel Planner

**Production-ready AI travel planning platform with ML-powered recommendations and real-time user behavior tracking**

## 🚀 Quick Start

```bash
npm install
npm run dev
```

**Live App**: https://your-project-id.web.app

## ✨ Core Features

### 🤖 **GenAI-Powered Planning**
- **Gemini 2.0 Flash Integration** - Real-time itinerary generation with structured prompts
- **JSON Schema Validation** - Ensures consistent AI responses and handles hallucinations
- **Smart Prompt Engineering** - Few-shot learning with examples and constraints

### 🧠 **Machine Learning Pipeline**
- **User Behavior Tracking** - Real-time collection of clicks, ratings, time spent, bookings
- **Collaborative Filtering** - Find similar users and recommend activities they loved
- **Content-Based Filtering** - Fallback for new users based on preferences
- **ML Training Pipeline** - Continuous model improvement with Firebase Cloud Functions

### 🔥 **Firebase Integration**
- **Firestore Database** - Scalable NoSQL with proper indexing and security rules
- **Authentication** - Google Sign-In with user profile management
- **Real-time Updates** - Live data synchronization and user behavior tracking
- **Cloud Functions** - Server-side ML training and recommendation APIs

### 📱 **Modern Web Architecture**
- **Next.js 15** - App Router, SSR, static generation, and API routes
- **TypeScript** - Type-safe development with comprehensive interfaces
- **Tailwind CSS** - Mobile-first responsive design
- **Performance Optimized** - Lazy loading, Suspense boundaries, and caching

## 🛠 **Complete Tech Stack**

### **Frontend**
- Next.js 15, React 18, TypeScript
- Tailwind CSS, Lucide React Icons
- Custom hooks and context providers

### **Backend & AI**
- Google Gemini 2.0 Flash API
- Firebase Firestore, Authentication, Cloud Functions
- Custom ML recommendation engine

### **DevOps & Deployment**
- Firebase Hosting with CI/CD
- Rate limiting and error handling
- Production monitoring and analytics

## 📁 **Project Architecture**

```
src/
├── app/                    # Next.js App Router
├── components/             # Reusable UI components
│   ├── forms/             # Form components with validation
│   ├── itinerary/         # Display components
│   └── flights/           # Flight search integration
├── hooks/                 # Custom React hooks
│   ├── useItineraryGenerator.ts
│   ├── useMLRecommendations.ts
│   └── useSessionManager.ts
├── services/              # Business logic layer
│   ├── aiService.ts       # Gemini AI integration
│   ├── mlTrainingService.ts # ML pipeline
│   ├── flightsService.ts  # Flight search
│   └── placesService.ts   # Places data
├── lib/                   # Utilities & configuration
│   ├── firebase.ts        # Firebase setup
│   ├── validation.ts      # Input validation
│   └── rateLimiter.ts     # Rate limiting
└── contexts/              # React contexts
    └── AuthContext.tsx    # Authentication state

firebase-config/           # Firebase configuration files
├── firestore.rules        # Database security rules
└── firestore.indexes.json # Database indexes
```

## 🔧 **Setup & Deployment**

### **1. Local Development**
```bash
npm install
npm run dev
```

### **2. Firebase Setup**
- Create Firebase project with Firestore enabled
- Configure database ID as `floofie-db`
- Deploy security rules and indexes

### **3. Production Deployment**
```bash
npm run build
firebase deploy --only hosting
```

## 🎯 **Key Implementation Highlights**

### **AI Service Architecture**
- Structured prompt engineering with system prompts
- JSON schema validation and error handling
- Fallback mechanisms for AI service failures
- Rate limiting and request optimization

### **ML Recommendation System**
- Real-time user behavior collection
- Collaborative filtering algorithm
- User preference analysis and clustering
- Continuous model training and improvement

### **Production Features**
- Comprehensive error handling and recovery
- Input validation and sanitization
- Rate limiting and abuse prevention
- Mobile-responsive design with touch interactions
- Real-time data synchronization

## 📚 **Configuration Files**

- `firestore.rules` - Database security rules
- `firestore.indexes.json` - Database indexes for optimal performance
- `firebase.json` - Firebase project configuration

## 🚀 **Live Features**

- ✅ **Real-time AI Itinerary Generation**
- ✅ **ML-Powered Recommendations**
- ✅ **User Behavior Tracking**
- ✅ **Save/Load Personal Itineraries**
- ✅ **Google Maps & Calendar Integration**
- ✅ **Mobile-First Responsive Design**
- ✅ **Production-Ready Deployment**

---

**Built with 🐼 by Floofie - Your Smart Travel Companion**

*Showcasing expertise in GenAI, Machine Learning, Firebase, and modern web development*