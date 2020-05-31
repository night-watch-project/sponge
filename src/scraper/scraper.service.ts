import { Injectable } from "@nestjs/common"
import { firefox } from "playwright"
import type { FirefoxBrowser } from "playwright"
import type { InputTarget } from "./classes/input-target.class"
import type { OutputTarget } from "./classes/output-target.class"

@Injectable()
export class ScraperService {
  private browser?: FirefoxBrowser

  private async launchIfNeeded(): Promise<FirefoxBrowser> {
    if (!this.browser) {
      this.browser = await firefox.launch()
    }
    return this.browser
  }

  private async close(): Promise<void> {
    await this.browser?.close()
    this.browser = undefined
  }

  public async run(url: string, targets: InputTarget[]): Promise<OutputTarget[]> {
    const browser = await this.launchIfNeeded()
    const context = await browser.newContext()
    context.setDefaultTimeout(10 * 1000) // 10s
    const page = await context.newPage()

    try {
      await page.goto(url)

      return await Promise.all(
        targets.map(async (target) => {
          const { cssSelector, type = "string", name, description } = target

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

          return { cssSelector, type, value, name, description }
        })
      )
    } finally {
      await page.close()
      await context.close()
    }
  }
}
