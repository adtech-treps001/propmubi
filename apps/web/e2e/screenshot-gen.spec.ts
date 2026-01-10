import { test } from '@playwright/test';

test.describe('Demo Asset Generation', () => {

    // Helper to mock data for perfect screenshots
    test.beforeEach(async ({ page }) => {
        // Mock Feed
        await page.route('*/**/projects/feed', async route => {
            await route.fulfill({
                json: [
                    {
                        id: "100",
                        name: "My Home Sayuk",
                        developer: "My Home Constructions",
                        location: "Tellapur, Hyderabad",
                        price_range: "₹ 1.2 Cr - 3.5 Cr",
                        image: "https://is1-3.housingcdn.com/4f2250e8/6d582823625b045371676999e52504b5/v0/fs/my_home_sayuk-tellapur-hyderabad-my_home_group.jpeg",
                        trust_score: 94
                    }
                ]
            });
        });

        // Mock Stats
        await page.route('*/**/dashboard/stats', async route => {
            await route.fulfill({
                json: { verified_leads: 142, unverified_leads: 45, trust_score: 92 }
            });
        });
    });

    test('Capture All Screens', async ({ page }) => {
        // 1. Consumer Feed (Mobile)
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/consumer');
        await page.waitForTimeout(1000); // Wait for images
        await page.screenshot({ path: 'public/demo_assets/screen_consumer_feed.png' });

        // 2. Project Details (Desktop)
        await page.setViewportSize({ width: 1280, height: 800 });
        await page.goto('/projects/100');
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'public/demo_assets/screen_project_details.png' });

        // 3. Builder Dashboard
        await page.goto('/builder');
        await page.waitForTimeout(1000); // Wait for charts
        await page.screenshot({ path: 'public/demo_assets/screen_builder_dashboard.png' });

        // 4. Agent CRM
        await page.goto('/agent');
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'public/demo_assets/screen_agent_crm.png' });

        // 5. Magic Onboard
        await page.goto('/onboard');
        await page.screenshot({ path: 'public/demo_assets/screen_magic_onboard.png' });

        // 6. Agent Microsite
        await page.goto('/microsite/demo');
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'public/demo_assets/screen_agent_microsite.png' });
    });
});
