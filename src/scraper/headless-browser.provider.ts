import { firefox } from "playwright-firefox"
import type { FirefoxBrowser } from "playwright-firefox"

export class HeadlessBrowser {
  private static browser?: FirefoxBrowser

  /**
   * Launch browser if needed.
   */
  public static async launch(): Promise<FirefoxBrowser> {
    if (!HeadlessBrowser.browser) {
      HeadlessBrowser.browser = await firefox.launch()
    }
    return HeadlessBrowser.browser
  }

  /**
   * Close browser and all of its pages (if any were opened).
   */
  public static async close(): Promise<void> {
    await HeadlessBrowser.browser?.close()
    HeadlessBrowser.browser = undefined
  }
}
