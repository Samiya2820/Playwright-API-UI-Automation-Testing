import { expect, Locator, Page } from '@playwright/test';

/** The JB Hi-Fi site header and its "Products" mega menu; both appear on every page. */
export class HeaderComponent {
  readonly logo: Locator;
  readonly searchBox: Locator;
  readonly productsMenu: Locator;
  readonly trackOrder: Locator;
  readonly stores: Locator;
  readonly logIn: Locator;
  readonly cart: Locator;
  private readonly menuRows: Locator;

  constructor(private readonly page: Page) {
    this.menuRows = page
      .getByTestId('navigation-menu-dropdown-item-button')
      .filter({ visible: true });
    // getByTestId() reads the site's own data-testid attributes, which exist for automation.
    this.logo = page.getByTestId('header-jb-logo');
    this.searchBox = page.getByPlaceholder(/search products/i);
    this.productsMenu = page.getByRole('button', { name: 'Products', exact: true });
    this.trackOrder = page.getByTestId('header-track-order');
    this.stores = page.getByTestId('header-stores');
    this.logIn = page.getByTestId('header-account');
    this.cart = page.getByTestId('minicart-toggle');
  }

  /** Label -> locator for every element the home page test must find. */
  get navigationItems(): Record<string, Locator> {
    return {
      'Logo': this.logo,
      'Search bar': this.searchBox,
      'Products menu': this.productsMenu,
      'Track order': this.trackOrder,
      'Stores': this.stores,
      'Log in': this.logIn,
      'Cart': this.cart,
    };
  }

  /**
   * The site is JavaScript-heavy: the page appears before its scripts are attached, so an
   * early Enter or click is silently ignored. toPass() retries the whole block until the
   * result we expect (a navigation / an open menu) actually happens.
   */
  async search(term: string): Promise<void> {
    await expect(async () => {
      await this.searchBox.fill(term);
      await this.searchBox.press('Enter');
      await expect(this.page).toHaveURL(/\/search\?query=/, { timeout: 3_000 });
    }).toPass({ timeout: 30_000 });
  }

  async openProductsMenu(): Promise<void> {
    await expect(async () => {
      await this.productsMenu.click();
      await expect(this.menuRows.first()).toBeVisible({ timeout: 2_000 });
    }).toPass({ timeout: 30_000 });
  }

  /** Opens a sub-panel of the open menu, e.g. "TVs & Home Theatre"; only visible rows count, since hidden panels repeat some names. */
  async openMenuItem(name: string): Promise<void> {
    await this.menuRows.filter({ hasText: name }).first().click();
  }

  /** A link inside the open menu, e.g. "Shop all" or "40-44 Inch TVs". */
  menuLink(name: string): Locator {
    return this.page
      .getByTestId('navigation-menu-dropdown-item-link')
      .filter({ hasText: name })
      .filter({ visible: true })
      .first();
  }
}
