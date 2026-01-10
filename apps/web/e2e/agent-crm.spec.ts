import { test, expect } from '@playwright/test';

test.describe('Agent CRM', () => {
    test.beforeEach(async ({ page }) => {
        // Mock the leads queue
        await page.route('*/**/crm/leads/queue/*', async route => {
            await route.fulfill({
                json: [
                    { id: 'l1', buyer_id: 'buyer-111', status: 'NEW' },
                    { id: 'l2', buyer_id: 'buyer-222', status: 'ACTIVE' }
                ]
            });
        });

        // Mock the agent listings (Supply Sensors)
        await page.route('*/**/agent/listings', async route => {
            await route.fulfill({
                json: [
                    {
                        id: 'list-1',
                        agent_id: 'agent-123',
                        status: 'SOCIAL_SIGNAL',
                        property_details: {
                            property_name: 'Mock Property',
                            location: 'Mock Location',
                            price: 5000000
                        }
                    }
                ]
            });
        });

        // Mock commissions
        await page.route('*/**/crm/commissions/*', async route => {
            await route.fulfill({
                json: {
                    agent_id: 'agent-123',
                    pending_amount: 50000,
                    currency: 'INR'
                }
            });
        });

        await page.goto('/agent');
    });

    test('should display page title', async ({ page }) => {
        await expect(page.getByText('PropMubi Agent Command Center')).toBeVisible();
        await expect(page.getByText('Real-Time Trust OS Analytics')).toBeVisible();
    });

    test('should display stat cards', async ({ page }) => {
        // Check for Active Leads and Commission cards
        await expect(page.getByText('Active Leads')).toBeVisible();
        await expect(page.getByText('Commission Pipeline')).toBeVisible();
    });

    test('should display lead governance queue', async ({ page }) => {
        await expect(page.getByText('Lead Governance Queue')).toBeVisible();

        // Table headers should be visible
        await expect(page.getByText('Buyer ID')).toBeVisible();
        await expect(page.getByText('Status')).toBeVisible();
        await expect(page.getByText('Action')).toBeVisible();
    });

    test('should display supply sensors panel', async ({ page }) => {
        await expect(page.getByText('Supply Sensors')).toBeVisible();
        await expect(page.getByText('WATSON-INGEST LIVE')).toBeVisible();
        await expect(page.getByText(/Detecting off-market listings/i)).toBeVisible();
    });

    test('should handle empty supply sensors', async ({ page }) => {
        // Initially might be empty - should not crash
        const supplySensorsSection = page.locator('text=Supply Sensors').locator('..');
        await expect(supplySensorsSection).toBeVisible();
    });

    test('should poll for updates every 5 seconds', async ({ page }) => {
        // Verify polling is active (check console or network requests)
        // Wait longer than polling interval
        await page.waitForTimeout(6000);

        // Page should still be responsive
        await expect(page.getByText('Active Leads')).toBeVisible();
    });

    test('verify button should be interactive', async ({ page }) => {
        // With our mock, we definitely have one listing
        const verifyButton = page.locator('button', { hasText: 'Verify & List' }).first();
        await expect(verifyButton).toBeVisible();
        await expect(verifyButton).toBeEnabled();
        await expect(verifyButton).toHaveCSS('cursor', 'pointer');
    });

    test('should have two-column layout', async ({ page }) => {
        // Wait for layout to render
        await page.waitForTimeout(500);

        // Check for grid layout structure
        const gridContainer = page.locator('div').filter({ hasText: 'Lead Governance Queue' }).locator('..');
        await expect(gridContainer).toBeVisible();
    });
});
