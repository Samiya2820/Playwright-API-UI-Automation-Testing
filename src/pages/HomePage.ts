import { Page } from '@playwright/test';
import { HeaderComponent } from './HeaderComponent';
import { dismissMarketingPopups } from '../utils/popups';

export class HomePage {
  readonly header: HeaderComponent;

  constructor(private readonly page: Page) {
    this.header = new HeaderComponent(page);
  }

  async open(): Promise<void> {
    await dismissMarketingPopups(this.page);
    await this.page.goto('/');
  }
}
