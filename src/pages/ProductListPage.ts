import { Locator, Page } from '@playwright/test';

/** Any page that shows a heading plus a grid of product cards: category pages and search results. */
export class ProductListPage {
  readonly heading: Locator;
  readonly productCards: Locator;

  constructor(page: Page) {
    this.heading = page.getByRole('heading', { level: 1 });
    this.productCards = page.getByTestId('product-card-content');
  }

  /** Product cards whose visible text (title, brand, ...) matches the given text or pattern. */
  cardsMatching(text: string | RegExp): Locator {
    return this.productCards.filter({ hasText: text });
  }
}
