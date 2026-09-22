import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';
import { ProductListPage } from '../../src/pages/ProductListPage';
import { saveScreenshot } from '../../src/utils/screenshot';

test.describe('JB Hi-Fi - navigation and search', () => {
  test('1. home page shows the key navigation elements', async ({ page }) => {
    const home = new HomePage(page);
    await home.open();

    // Soft assertions: a failure is recorded but the loop keeps going,
    // so one run lists every missing element instead of only the first.
    for (const [label, locator] of Object.entries(home.header.navigationItems)) {
      await expect.soft(locator, `${label} should be visible`).toBeVisible();
    }

    await saveScreenshot(page, '01-home-page', { fullPage: true });
  });

  test('2. menu navigation: Products > TVs & Home Theatre > landing page and sub-category', async ({
    page,
  }) => {
    const home = new HomePage(page);
    const list = new ProductListPage(page);
    await home.open();

    // Landing page: Products > TVs & Home Theatre > Shop all
    await home.header.openProductsMenu();
    await home.header.openMenuItem('TVs & Home Theatre');
    await home.header.menuLink('Shop all').click();

    await expect(page).toHaveURL(/\/collections\/tvs\/?$/);
    await expect(list.heading).toHaveText('TVs & Home Theatre');
    await expect(list.productCards).not.toHaveCount(0);
    await saveScreenshot(page, '02a-tvs-landing-page');

    // Sub-category: Products > TVs & Home Theatre > TVs by screen size > 40-44 Inch TVs
    await home.header.openProductsMenu();
    await home.header.openMenuItem('TVs & Home Theatre');
    await home.header.openMenuItem('TVs by screen size');
    await home.header.menuLink('40-44 Inch TVs').click();

    await expect(page).toHaveURL(/\/collections\/tvs\/tvs-40-44/);
    await expect(list.heading).toBeVisible();
    await expect(list.productCards).not.toHaveCount(0);
    await saveScreenshot(page, '02b-tvs-40-44-inch-sub-category');
  });

  test('3. search shows results that contain the search term', async ({ page }) => {
    const term = 'Samsung S90F';
    const home = new HomePage(page);
    const results = new ProductListPage(page);
    await home.open();

    await home.header.search(term);

    await expect(page).toHaveURL(/\/search\?query=Samsung(%20|\+)S90F/i);
    await expect(results.heading).toHaveText(new RegExp(`\\d+ results? for "${term}"`));
    // The search term must appear in at least one product card.
    await expect(results.cardsMatching(/S90F/i).first()).toBeVisible();

    await saveScreenshot(page, '03-search-results');
  });
});
