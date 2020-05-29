const { firefox } = require("playwright-firefox")

module.exports.HeadlessBrowser = class HeadlessBrowser {
  static browser = null

  static async launchIfNeeded() {
    if (!HeadlessBrowser.browser) {
      HeadlessBrowser.browser = await firefox.launch()
    }
  }

  static async close() {
    await HeadlessBrowser.browser.close()
    HeadlessBrowser.browser = null
  }

  async scrape(url, targets) {
    await HeadlessBrowser.launchIfNeeded()
    const context = await HeadlessBrowser.browser.newContext()
    const page = await context.newPage()

    try {
      await page.goto(url)

      const resultTargets = await Promise.all(
        targets.map(async (target) => {
          const { name, cssSelector, type = "string" } = target

          const handle = await page.waitForSelector(cssSelector)
          const rawValue = (await handle.textContent()).trim()
          const value = type === "number" ? parseFloat(rawValue) : rawValue

          return { name, cssSelector, type, value }
        })
      )

      return resultTargets
    } finally {
      await page.close()
      await context.close()
    }
  }
}
