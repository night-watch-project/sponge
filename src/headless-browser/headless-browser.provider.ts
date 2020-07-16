import { firefox } from "playwright-firefox"
import type { FirefoxBrowser } from "playwright-firefox"

export class HeadlessBrowserProvider {
  private static browser?: FirefoxBrowser

  public static get providerName(): string {
    return "HEADLESS_BROWSER"
  }

  /**
   * Launch browser if needed.
   */
  public static async init(): Promise<FirefoxBrowser> {
    if (!HeadlessBrowserProvider.browser) {
      HeadlessBrowserProvider.browser = await firefox.launch()
    }
    return HeadlessBrowserProvider.browser
  }

  /**
   * Close browser and all of its pages (if any were opened).
   */
  public static async close(): Promise<void> {
    await HeadlessBrowserProvider.browser?.close()
    HeadlessBrowserProvider.browser = undefined
  }
}
