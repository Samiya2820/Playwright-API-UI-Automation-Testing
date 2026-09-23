import { test } from '@playwright/test';
import { saveScreenshot } from '../../../src/utils/screenshot';
import { HomePageUI, CategoryPageUI, SearchPageUI } from '../../../src/utils/uiTestData';
import {
  navigateToHomepage,
  verifyHeaderElements,
  navigateToProductsMenuAndSelectCategory,
  navigateToSubCategory,
  searchForProduct,
} from './jbhifi.page';

test.describe('JB Hi-Fi - navigation and search', () => {
  
  test('Home page shows the key navigation elements', async ({ page }) => {
    await navigateToHomepage(page);
    await verifyHeaderElements(
      page,
      HomePageUI.productMenu,
      HomePageUI.trackOrderButton,
      HomePageUI.storesButton,
      HomePageUI.loginButton,
      HomePageUI.cartButton,
    );

    await saveScreenshot(page, '01-home-page', { fullPage: true });
  });

  test('Menu navigation: Products > TVs & Home Theatre > landing page and sub-category', async ({
    page,
  }) => {
    await test.step('Navigate to JB Hi-Fi home page', async () => {
      await navigateToHomepage(page);
    });

    await test.step('Open Products menu and select TVs & Home Theatre', async () => {
      await navigateToProductsMenuAndSelectCategory(page, HomePageUI.productMenu, CategoryPageUI.categoryTitle);
    });
    await saveScreenshot(page, '02a-tvs-landing-page');

    await test.step('Select TVs by screen size > 40-44 Inch TVs', async () => {
      await navigateToSubCategory(page, CategoryPageUI.subCategoryTitle, CategoryPageUI.subCategoryType);
    });
    await saveScreenshot(page, '02b-tvs-40-44-inch-sub-category');
  });

  test('Search shows results that contain the search term', async ({ page }) => {
    await navigateToHomepage(page);
    await searchForProduct(page, SearchPageUI.searchTerm, SearchPageUI.searchResultProduct);

    await saveScreenshot(page, '03-search-results');
  });
});
