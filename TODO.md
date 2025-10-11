# TODO: Fix Weather Dropdown

## Current Issue
The dropdown in the travel tool of the weather section is not populated with destinations because the 'destinations' variable is not passed to the view.

## Plan
- Modify routes/weather.js to fetch unique locations from listings and pass them as 'destinations' to the weather.ejs view.

## Steps
- [x] Edit routes/weather.js to add logic for fetching destinations using Listing.distinct('location')
- [ ] Test the weather page to ensure dropdown is populated with locations
- [ ] Verify that selecting a destination triggers the weather search functionality
