# Offline Mode for Itinerary Access - Implementation Plan

## Current Status
- ✅ Analyzed existing codebase and identified gaps
- ✅ Created comprehensive implementation plan
- ✅ Got user approval to proceed

## Tasks to Complete

### 1. Fix Trip Detail Download Button
- [ ] Update `views/tripPlanner/tripDetail.ejs` script to use correct `OfflineManager.saveTripForOffline()` method
- [ ] Add proper error handling and success feedback

### 2. Add Download Buttons to My-Trips Page
- [ ] Add download buttons to each trip card in `views/tripPlanner/myTrips.ejs`
- [ ] Implement download functionality with toast notifications
- [ ] Add visual indicators for downloaded trips

### 3. Enhance Service Worker Caching
- [ ] Update `public/sw.js` to better cache trip detail pages
- [ ] Ensure offline trip data is served from cache when network unavailable

### 4. Add Offline Trips API Endpoint
- [ ] Add `/trip-planner/api/offline-trips` endpoint in `routes/tripPlanner.js`
- [ ] Return cached trips when offline, fallback to database when online

### 5. Add Sync Endpoint
- [ ] Add `/trip-planner/api/sync` endpoint for syncing offline changes
- [ ] Integrate with existing OfflineManager sync functionality

### 6. Add Toast Notifications
- [ ] Create reusable toast notification system
- [ ] Add toasts for download success/failure, sync status, offline/online status

### 7. Update Offline Trip Display
- [ ] Modify trip list rendering to show cached trips when offline
- [ ] Add offline indicators and sync status badges

## Testing Checklist
- [ ] Test offline functionality in browser dev tools
- [ ] Verify PWA install prompt appears
- [ ] Test automatic sync when reconnecting
- [ ] Ensure cached trips load instantly offline
- [ ] Test trip downloads from both detail and list views

## Files to Edit
- `views/tripPlanner/tripDetail.ejs`
- `views/tripPlanner/myTrips.ejs`
- `routes/tripPlanner.js`
- `public/sw.js`
