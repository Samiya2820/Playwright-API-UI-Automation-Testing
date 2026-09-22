import { Page } from '@playwright/test';

/**
  *`addLocatorHandler()` auto-closes JB Hi-Fi's timed signup popup whenever it appears, 
  * so it never blocks a click or screenshot.
 */
export async function dismissMarketingPopups(page: Page): Promise<void> {
  const closeButton = page.getByTestId('modal-form-container').getByRole('button', { name: 'Close dialog' });

  await page.addLocatorHandler(closeButton, async () => {
    await closeButton.click();
  });
}
