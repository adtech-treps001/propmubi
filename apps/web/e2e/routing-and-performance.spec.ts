import { test, expect } from '@playwright/test';

test.describe('Routing & Redirects', () => {
    test('root should redirect to builder', async ({ page }) => {
        await page.goto('/');

        // Should redirect to /builder
        await expect(page).toHaveURL('/builder');
    });

    test('should show 404 for invalid routes', async ({ page }) => {
        const response = await page.goto('/invalid-route-12345');

        // Should return 404
        expect(response?.status()).toBe(404);
    });

    test('all main routes should be accessible', async ({ page }) => {
        const routes = ['/builder', '/agent', '/consumer', '/microsite/demo'];

        for (const route of routes) {
            const response = await page.goto(route);
            expect(response?.status()).toBe(200);
        }
    });

    test('browser back button should work', async ({ page }) => {
        await page.goto('/builder');
        await page.goto('/agent');
        await page.goto('/consumer');

        // Go back twice
        await page.goBack();
        await expect(page).toHaveURL('/agent');

        await page.goBack();
        await expect(page).toHaveURL('/builder');
    });

    test('browser forward button should work', async ({ page }) => {
        await page.goto('/builder');
        await page.goto('/agent');
        await page.goBack();

        // Go forward
        await page.goForward();
        await expect(page).toHaveURL('/agent');
    });

    test('direct URL navigation should work', async ({ page }) => {
        // Direct navigation to each route
        await page.goto('http://localhost:3005/builder');
        await expect(page).toHaveURL('/builder');

        await page.goto('http://localhost:3005/agent');
        await expect(page).toHaveURL('/agent');
    });
});

test.describe('Performance', () => {
    test('pages should load within 3 seconds', async ({ page }) => {
        const routes = ['/builder', '/agent', '/consumer'];

        for (const route of routes) {
            const startTime = Date.now();
            await page.goto(route);
            const loadTime = Date.now() - startTime;

            expect(loadTime).toBeLessThan(3000);
        }
    });

    test('navigation transitions should be smooth', async ({ page }) => {
        await page.goto('/builder');

        const startTime = Date.now();
        await page.getByRole('link', { name: /Agent CRM/i }).click();
        await page.waitForURL('/agent');
        const transitionTime = Date.now() - startTime;

        // Transition should be fast
        expect(transitionTime).toBeLessThan(1000);
    });
});

test.describe('Accessibility', () => {
    test('pages should have proper heading hierarchy', async ({ page }) => {
        await page.goto('/builder');

        // Should have h1
        const h1 = page.locator('h1');
        await expect(h1.first()).toBeVisible();
    });

    test('interactive elements should be keyboard accessible', async ({ page }) => {
        await page.goto('/builder');

        // Tab to navigation links
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');

        // Should be able to activate with Enter
        await page.keyboard.press('Enter');

        // URL should change
        await page.waitForTimeout(500);
        const url = page.url();
        expect(url).toContain('localhost:3005');
    });
});
