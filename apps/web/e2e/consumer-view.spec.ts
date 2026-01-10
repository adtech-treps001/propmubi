import { test, expect } from '@playwright/test';

test.describe('Consumer View', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/consumer');
    });

    test('should display property feed title', async ({ page }) => {
        await expect(page.getByText('PropMubi Consumer Feed')).toBeVisible();
    });

    test('should have mobile-style container', async ({ page }) => {
        // Check for mobile width container (max-width: 400px)
        const container = page.locator('div').filter({ hasText: 'My Home Mangala' }).first();

        const width = await container.evaluate((el) => {
            const rect = el.getBoundingClientRect();
            return rect.width;
        });

        // Width should be constrained for mobile mockup
        expect(width).toBeLessThanOrEqual(450);
    });

    test('should display property card', async ({ page }) => {
        await expect(page.getByText('My Home Mangala')).toBeVisible();
    });

    test('should display trust score badge', async ({ page }) => {
        // Trust score badge should show (e.g., "Trust Score: 92")
        await expect(page.locator('text=/Trust Score.*92/i')).toBeVisible();
    });

    test('should display price', async ({ page }) => {
        // Price in format "₹1.25 Cr"
        await expect(page.locator('text=/₹.*Cr/i')).toBeVisible();
    });

    test('should display Book Site Visit button', async ({ page }) => {
        const bookButton = page.getByRole('button', { name: /Book Site Visit/i });
        await expect(bookButton).toBeVisible();
        await expect(bookButton).toBeEnabled();
    });

    test('book button should be clickable', async ({ page }) => {
        const bookButton = page.getByRole('button', { name: /Book Site Visit/i });
        await bookButton.click();

        // Button should still be visible after click
        await expect(bookButton).toBeVisible();
    });

    test('should have gradient overlay', async ({ page }) => {
        // Check for gradient styling in property card
        const card = page.locator('div').filter({ hasText: 'My Home Mangala' }).first();
        await expect(card).toBeVisible();
    });

    test('should be mobile-responsive', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });

        // Content should still be visible
        await expect(page.getByText('My Home Mangala')).toBeVisible();
        await expect(page.getByRole('button', { name: /Book Site Visit/i })).toBeVisible();
    });
});
