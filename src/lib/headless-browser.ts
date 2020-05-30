import { firefox } from "playwright-firefox"
import type { FirefoxBrowser } from "playwright-firefox"
import type { InputTarget, OutputTarget } from "./types"

export class HeadlessBrowser {
  static browser?: FirefoxBrowser

  static async launchIfNeeded(): Promise<FirefoxBrowser> {
    if (!HeadlessBrowser.browser) {
      HeadlessBrowser.browser = await firefox.launch()
    }
    return HeadlessBrowser.browser
  }

  static async close(): Promise<void> {
    await HeadlessBrowser.browser?.close()
    HeadlessBrowser.browser = undefined
  }

  static async scrape(url: string, targets: InputTarget[]): Promise<OutputTarget[]> {
    const browser = await HeadlessBrowser.launchIfNeeded()
    const context = await browser.newContext()
    context.setDefaultTimeout(10 * 1000) // 10s
    const page = await context.newPage()

    try {
      await page.goto(url)

      const resultTargets = await Promise.all(
        targets.map(async (target) => {
          const { cssSelector, type = "string" } = target

          const handle = await page.waitForSelector(cssSelector)
          const rawValue = await handle.textContent()
          let value
          if (rawValue === null) {
            value = null
          } else if (type === "number") {
            value = parseFloat(rawValue)
          } else {
            value = rawValue.trim()
          }

          return { cssSelector, type, value }
        })
      )

      return resultTargets
    } finally {
      await page.close()
      await context.close()
    }
  }
}
