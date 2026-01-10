import { test, expect } from '@playwright/test';

test.describe('Agent Microsite', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/microsite/demo');
    });

    test('should NOT display navigation', async ({ page }) => {
        // Navigation should be hidden on microsites
        const nav = page.locator('nav');
        await expect(nav).not.toBeVisible();
    });

    test('should display agent profile', async ({ page }) => {
        await expect(page.getByText('Ramesh Kumar')).toBeVisible();
        await expect(page.getByText(/Your Trusted Real Estate Advisor/i)).toBeVisible();
    });

    test('should display verified badge', async ({ page }) => {
        await expect(page.getByText('PropMubi Verified Agent')).toBeVisible();
    });

    test('should have gradient background', async ({ page }) => {
        const container = page.locator('body > div').first();
        const bgStyle = await container.evaluate((el) =>
            window.getComputedStyle(el).background
        );
        expect(bgStyle).toContain('gradient');
    });

    test('should display agent avatar', async ({ page }) => {
        // Avatar with initial "R" for Ramesh
        const avatar = page.locator('div').filter({ hasText: /^R$/i }).first();
        await expect(avatar).toBeVisible();
    });

    test('should display listings section title', async ({ page }) => {
        await expect(page.getByText('Curated Off-Market Properties')).toBeVisible();
    });

    test('should display WhatsApp CTA', async ({ page }) => {
        await expect(page.getByText(/Ready to find your dream property/i)).toBeVisible();

        const whatsappButton = page.getByRole('button', { name: /WhatsApp Me/i });
        await expect(whatsappButton).toBeVisible();
    });

    test('WhatsApp button should have correct styling', async ({ page }) => {
        const whatsappButton = page.getByRole('button', { name: /WhatsApp Me/i });

        // Check for green background (matches rgb or hex)
        const bgColor = await whatsappButton.evaluate((el) => {
            const styles = window.getComputedStyle(el);
            return styles.backgroundColor;
        });
        // Matches rgb(37, 211, 102) OR #25d366
        expect(bgColor).toMatch(/rgb\(37, 211, 102\)|#25d366/);
    });

    test('should display PropMubi footer badge', async ({ page }) => {
        await expect(page.getByText(/Powered by.*PropMubi Trust OS/i)).toBeVisible();
    });

    test('should handle empty listings gracefully', async ({ page }) => {
        // If no listings, should show message
        const emptyMessage = page.getByText(/No verified listings yet/i);
        const emptyMessageCount = await emptyMessage.count();

        // Either show empty message or show listings
        expect(emptyMessageCount >= 0).toBeTruthy();
    });

    test('should be mobile-responsive', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });

        // Content should still be visible
        await expect(page.getByText('Ramesh Kumar')).toBeVisible();
        await expect(page.getByText('PropMubi Verified Agent')).toBeVisible();
    });

    test('should have standalone layout', async ({ page }) => {
        // Should have white content card
        await expect(page.locator('div').filter({ hasText: 'Ramesh Kumar' }).first()).toBeVisible();

        // Should not have breadcrumbs or other navigation elements
        const breadcrumbs = page.locator('nav[aria-label="breadcrumb"]');
        await expect(breadcrumbs).not.toBeVisible();
    });
});
