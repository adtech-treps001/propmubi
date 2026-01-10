import { test, expect } from '@playwright/test';

test.describe('Magic Onboarding', () => {
    test.beforeEach(async ({ page }) => {
        // Mock Brochure Analysis
        await page.route('*/**/ingest/analyze/brochure', async route => {
            await route.fulfill({
                json: {
                    confidence_score: 0.95,
                    extracted_data: {
                        project_name: "Mock AI Tower",
                        developer: "Mock Developers",
                        rera_id: "P000MOCK123"
                    },
                    source_metadata: { filename: "brochure.pdf" }
                }
            });
        });

        // Mock URL Scraping
        await page.route('*/**/ingest/scrape/url', async route => {
            await route.fulfill({
                json: {
                    confidence_score: 0.88,
                    extracted_data: {
                        name: "Scraped Builder Inc",
                        established: 2020
                    }
                }
            });
        });

        await page.goto('/onboard');
    });

    test('should display magic onboarding UI', async ({ page }) => {
        await expect(page.getByText('Magic AI Onboarding')).toBeVisible();
        await expect(page.getByText("Don't type. Just upload")).toBeVisible();
    });

    test('should switch modes', async ({ page }) => {
        // Check default Agent mode
        await expect(page.getByText('RERA Card / Visiting Card')).toBeVisible();

        // Switch to Builder
        await page.getByRole('combobox').first().selectOption('BUILDER');
        await expect(page.getByText('Brochure / Project PDF')).toBeVisible();
    });

    test('should populate logs on scrape', async ({ page }) => {
        // Enter URL
        const urlInput = page.getByPlaceholder('https://...');
        await urlInput.fill('https://example.com');
        await urlInput.press('Enter');

        // Check logs appear
        await expect(page.getByText('Scraping https://example.com')).toBeVisible();

        // Check results appear (from mock)
        await expect(page.getByText('Scraped Builder Inc')).toBeVisible();
    });

    test('should show confirm button after success', async ({ page }) => {
        // Trigger scrape to get success state
        await page.getByText('Auto-Fill').click(); // Button helper

        // Confirm & Onboard button should appear
        await expect(page.getByText('Confirm & Onboard')).toBeVisible();
    });

    test('should allow provider selection', async ({ page }) => {
        const providerSelect = page.locator('select').nth(1);
        await providerSelect.selectOption('OLLAMA');

        // Verify value changed
        await expect(providerSelect).toHaveValue('OLLAMA');
    });
});
