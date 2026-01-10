import { test, expect } from '@playwright/test';

test.describe('Navigation Component', () => {
    test('should display navigation on all pages except microsites', async ({ page }) => {
        // Test navigation on builder page
        await page.goto('/builder');
        await expect(page.locator('nav')).toBeVisible();
        await expect(page.getByText('PropMubi')).toBeVisible();
        await expect(page.getByText('Trust OS')).toBeVisible();

        // Test navigation on agent page
        await page.goto('/agent');
        await expect(page.locator('nav')).toBeVisible();

        // Test navigation on consumer page
        await page.goto('/consumer');
        await expect(page.locator('nav')).toBeVisible();

        // Test NO navigation on microsite
        await page.goto('/microsite/demo');
        const nav = page.locator('nav');
        await expect(nav).not.toBeVisible();
    });

    test('should highlight active navigation link', async ({ page }) => {
        await page.goto('/builder');

        // Builder link should be active
        const builderLink = page.getByRole('link', { name: /Builder Dashboard/i });
        await expect(builderLink).toHaveCSS('border-bottom', /4px solid/);

        // Click Agent link
        await page.getByRole('link', { name: /Agent CRM/i }).click();
        await page.waitForURL('/agent');

        // Agent link should now be active
        const agentLink = page.getByRole('link', { name: /Agent CRM/i });
        await expect(agentLink).toHaveCSS('border-bottom', /4px solid/);
    });

    test('should navigate between pages', async ({ page }) => {
        await page.goto('/builder');

        // Navigate to Agent CRM
        await page.getByRole('link', { name: /Agent CRM/i }).click();
        await expect(page).toHaveURL('/agent');

        // Navigate to Consumer View
        await page.getByRole('link', { name: /Consumer View/i }).click();
        await expect(page).toHaveURL('/consumer');

        // Navigate back to Builder
        await page.getByRole('link', { name: /Builder Dashboard/i }).click();
        await expect(page).toHaveURL('/builder');
    });

    test('logo should redirect to builder dashboard', async ({ page }) => {
        await page.goto('/consumer');

        // Click logo
        await page.getByRole('link', { name: /PropMubi/i }).first().click();
        await expect(page).toHaveURL('/builder');
    });
});
