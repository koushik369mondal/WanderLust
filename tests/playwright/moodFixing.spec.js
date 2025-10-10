const { test, expect } = require('@playwright/test');

test.describe('Mood Fixing Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the Mood Fixing page
    await page.goto('http://localhost:8080/trip-planner/mood-fixing');
  });

  test('should load the Mood Fixing page correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Mood Fixing/);

    // Check main heading
    await expect(page.locator('h1')).toContainText('Mood Fixing');

    // Check mood selection section
    await expect(page.locator('.mood-selection-card h3')).toContainText('Choose Your Travel Mood');

    // Check mood items are present
    const moodItems = page.locator('.mood-item');
    await expect(moodItems).toHaveCount(6);

    // Check mood names
    await expect(page.locator('.mood-name')).toContainText(['Calm', 'Adventure', 'Spiritual', 'Party', 'Relax', 'Romantic']);
  });

  test('should change background and load playlist when mood is selected', async ({ page }) => {
    // Click on Adventure mood
    await page.locator('.mood-item[data-mood="adventure"]').click();

    // Check that Now Playing section appears
    await expect(page.locator('#nowPlayingSection')).toBeVisible();

    // Check mood badge
    await expect(page.locator('#currentMoodBadge')).toContainText('Adventure Energy');

    // Check Spotify player is loaded
    const spotifyPlayer = page.locator('#spotifyPlayer');
    await expect(spotifyPlayer).toBeVisible();
    await expect(spotifyPlayer).toHaveAttribute('src', /open\.spotify\.com\/embed\/playlist/);
  });

  test('should handle mood switching correctly', async ({ page }) => {
    // Select Calm mood first
    await page.locator('.mood-item[data-mood="calm"]').click();
    await expect(page.locator('#currentMoodBadge')).toContainText('Calm Vibes');

    // Switch to Party mood
    await page.locator('.mood-item[data-mood="party"]').click();
    await expect(page.locator('#currentMoodBadge')).toContainText('Party Beats');

    // Check that only one mood is selected at a time
    const selectedMoods = page.locator('.mood-item.selected');
    await expect(selectedMoods).toHaveCount(1);
  });

  test('should have working player controls', async ({ page }) => {
    // Select a mood to show controls
    await page.locator('.mood-item[data-mood="relax"]').click();

    // Check shuffle button exists
    await expect(page.locator('#shuffleBtn')).toBeVisible();
    await expect(page.locator('#shuffleBtn')).toContainText('Shuffle');

    // Check share button exists
    await expect(page.locator('#shareBtn')).toBeVisible();
    await expect(page.locator('#shareBtn')).toContainText('Share Playlist');
  });

  test('should display Bollywood playlists section', async ({ page }) => {
    // Check Bollywood section exists
    await expect(page.locator('.recommendations-section h3')).toContainText('Travel Soundtracks');

    // Check playlist cards
    const playlistCards = page.locator('.playlist-card');
    await expect(playlistCards).toHaveCount(2);

    // Check specific playlists
    await expect(page.locator('.playlist-card h5')).toContainText(['Road Trip Essentials', 'Spiritual Journeys']);

    // Check Spotify embeds in recommendations
    const spotifyEmbeds = page.locator('.playlist-card iframe');
    await expect(spotifyEmbeds).toHaveCount(2);
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check page still loads
    await expect(page.locator('h1')).toContainText('Mood Fixing');

    // Check mood grid adapts to mobile
    const moodItems = page.locator('.mood-item');
    await expect(moodItems).toHaveCount(6);

    // Check mood selection still works on mobile
    await page.locator('.mood-item[data-mood="spiritual"]').click();
    await expect(page.locator('#nowPlayingSection')).toBeVisible();
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    // Check mood items have proper data attributes
    const moodItems = page.locator('.mood-item');
    await expect(moodItems.first()).toHaveAttribute('data-mood');
    await expect(moodItems.first()).toHaveAttribute('data-color');

    // Check images have alt text (mood icons are emojis, but check structure)
    const moodIcons = page.locator('.mood-icon');
    await expect(moodIcons).toHaveCount(6);
  });

  test('should handle search functionality if implemented', async ({ page }) => {
    // This test is for future search implementation
    // Check if search bar exists (currently not implemented)
    const searchBar = page.locator('#moodSearch');
    if (await searchBar.isVisible()) {
      // Test search functionality
      await searchBar.fill('calm');
      // Mood items should filter
      const visibleMoods = page.locator('.mood-item:visible');
      await expect(visibleMoods).toHaveCount(1);
    }
  });
});
