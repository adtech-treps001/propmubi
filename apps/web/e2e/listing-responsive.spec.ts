import { test, expect } from '@playwright/test';

test.describe('Listing Responsiveness', () => {

    test.beforeEach(async ({ page }) => {
        await page.route('*/**/projects/feed', async route => {
            await route.fulfill({
                json: [
                    {
                        id: "100",
                        name: "Mock Project Alpha",
                        developer: "Mock Devs",
                        location: "Cyber City",
                        price_range: "₹ 1.5 Cr - 2.0 Cr",
                        image: "https://via.placeholder.com/800",
                        trust_score: 95
                    }
                ]
            });
        });
    });

    test('Mobile View: Feed to Details Flow', async ({ page }) => {
        // iPhone SE viewport
        await page.setViewportSize({ width: 375, height: 667 });

        await page.goto('/consumer');

        // Wait for feed to load (using real API or mock if setup globally, but assuming real seeded data exists)
        // Adjust timeout if fetching real data takes time
        await expect(page.locator('text=PropMubi Consumer Feed')).toBeVisible({ timeout: 10000 });

        // Find "View Details" button and click
        // Taking the first one
        await page.getByRole('button', { name: 'View Details' }).first().click();

        // Verify we are on details page
        await expect(page).toHaveURL(/\/projects\/.+/);

        // Check for Mobile-specific elements
        const bookBtn = page.locator('button', { hasText: 'Book Visit' });
        await expect(bookBtn).toBeVisible();

        // Ensure Desktop grid is collapsed (check layout logic via visual assumption or class)
        // We added .mobile-only class for the bottom bar
        const mobileBar = page.locator('.mobile-only');
        await expect(mobileBar).toBeVisible();
    });

    test('Desktop View: Split Layout', async ({ page }) => {
        // Desktop viewport
        await page.setViewportSize({ width: 1280, height: 800 });

        // Navigate directly to a project (ID 100 is seeded in trending.py)
        await page.goto('/projects/100');

        // Verify Title
        await expect(page.locator('h1')).toBeVisible();

        // Check for Desktop-specific elements
        // .desktop-only class on "Trust Score" text
        const trustLabel = page.locator('.desktop-only');
        await expect(trustLabel).toBeVisible();

        // Check Sticky Booking Card presence
        await expect(page.getByPlaceholder('Your Name')).toBeVisible();

        // Ensure Mobile Bar is hidden
        const mobileBar = page.locator('.mobile-only');
        await expect(mobileBar).toBeHidden();
    });
});
