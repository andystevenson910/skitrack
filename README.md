# Ski Resort Tracker

## Overview
SkiTrack is a full-stack web application, currently hosted at [boardingandskiing.com](https://www.boardingandskiing.com) that enables skiing enthusiasts to document and share their mountain adventures. This production-grade application implements authentication, geolocation verification, and media management to create a seamless experience for tracking ski resort visits across America.

## Key Features

### User Authentication System
- Secure signup and login with Firebase authentication
- Protected routes ensuring authenticated access to personal dashboards
- Form validation with real-time error feedback
- Session management and automatic redirection

### Geolocation Verification
- Automatic device location detection using browser APIs
- Proximity validation before resort registration
- Location-based verification to prevent false entries
- Dynamic distance calculations for accurate resort tracking

### Resort Management Dashboard
- Personalized dashboard showing all visited resorts
- Visual card layout for intuitive navigation
- Single-click resort addition with automatic verification
- Instant notifications for user actions

### Media Gallery System
- Resort-specific photo galleries
- Drag-and-drop image uploading
- Image management with delete functionality
- Responsive gallery layout optimized for all devices

## Technical Implementation

### Frontend Architecture
- Built with Next.js (React) and TypeScript
- Component-based architecture with reusable UI elements
- Client-side routing with Next.js file-based system
- Responsive design using CSS modules

### Backend Services
- Authentication: Firebase Authentication
- Database: Firestore for real-time data synchronization
- Storage: Firebase Storage for media management
- Geolocation: Browser Geolocation API with distance calculations

### Performance Optimization
- Code splitting for efficient loading
- Memoized components to prevent unnecessary re-renders
- Efficient image handling with Next.js optimization
- Lazy loading for improved initial load times

## User Experience Highlights

### Dashboard Interface
1. Intuitive card-based layout for resort visualization
2. Persistent search and add functionality in header
3. Visual feedback for user actions
4. Responsive design across all device sizes

### Resort Page Experience
- Resort name prominently displayed in navigation
- Clean gallery view of user-uploaded images
- Immediate visual feedback after user actions
- Quick single click delete function

### Security Measures
- Encrypted authentication flows
- User-specific data partitioning
- Protected routes for authenticated content
- Server-side validation of all user actions

## Technical Specifications

| Component       | Technologies               |
|-----------------|----------------------------|
| Frontend        | Next.js, React, TypeScript |
| Styling         | CSS Modules                |
| Authentication  | Firebase Auth              |
| Database        | Firestore                  |
| Storage         | Firebase Storage           |
| Geolocation     | Browser Geolocation API    |
| Deployment      | Vercel                     |
