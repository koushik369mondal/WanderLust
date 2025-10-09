# Holiday Calendar Enhancement TODO

## Backend Changes
- [ ] Modify `/api/:country` endpoint to accept optional year parameter (`/api/:country/:year`)
- [ ] Update holiday fetching logic to use requested year
- [ ] Enhance holiday data to include categories (National, Religious, Cultural, Regional)
- [ ] Add festival highlighting flags in response
- [ ] Update fallback data to be dynamic by year

## Frontend Changes
- [ ] Add year selector dropdown in calendar.ejs
- [ ] Add search/filter input for month or event name
- [ ] Implement categorized view (group by type)
- [ ] Add icons/markers for festivals
- [ ] Add reminder toggle feature
- [ ] Update fetch calls to include selected year
- [ ] Update stats and holiday display for categories

## Integration & Features
- [ ] Connect with itinerary generator (link to trip planner)
- [ ] Implement offline caching for holiday data
- [ ] Implement reminder notifications (client-side)

## Testing
- [ ] Test dynamic year selection
- [ ] Test search/filter functionality
- [ ] Test categorized view
- [ ] Test reminder toggle
- [ ] Test offline caching
- [ ] Test integration with trip planner
