import { HttpService, Injectable } from "@nestjs/common"
import { JSDOM } from "jsdom"
import { firefox } from "playwright"
import type { FirefoxBrowser } from "playwright"
import type { InputTarget } from "./types/input-target.class"
import type { OutputTarget } from "./types/output-target.class"
import { TargetType } from "./types/target-type.enum"

@Injectable()
export class ScraperService {
  private browser?: FirefoxBrowser

  public constructor(private readonly httpService: HttpService) {}

  /**
   * Launch browser if needed.
   */
  private async launchIfNeeded(): Promise<FirefoxBrowser> {
    if (!this.browser) {
      this.browser = await firefox.launch()
    }
    return this.browser
  }

  /**
   * Close browser and all of its pages (if any were opened).
   */
  private async close(): Promise<void> {
    await this.browser?.close()
    this.browser = undefined
  }

  public scrape(
    url: string,
    targets: InputTarget[],
    csr = false
  ): Promise<OutputTarget[]> {
    if (csr) return this.scrapeCSR(url, targets)
    else return this.scrapeSSR(url, targets)
  }

  private async scrapeCSR(url: string, targets: InputTarget[]): Promise<OutputTarget[]> {
    const browser = await this.launchIfNeeded()
    const context = await browser.newContext()
    context.setDefaultTimeout(10 * 1000) // 10s
    const page = await context.newPage()

    try {
      await page.goto(url)

      return await Promise.all(
        targets.map(async (target) => {
          const {
            cssSelector,
            attribute,
            type = TargetType.String,
            name,
            description,
          } = target

          const handle = await page.waitForSelector(cssSelector)
          const rawValue = attribute
            ? await handle.getAttribute(attribute)
            : await handle.textContent()
          const value = this.parseRawValue(rawValue, type)

          return { cssSelector, attribute, type, value, name, description }
        })
      )
    } finally {
      await page.close()
      await context.close()
    }
  }

  private async scrapeSSR(url: string, targets: InputTarget[]): Promise<OutputTarget[]> {
    const res = await this.httpService.get(url).toPromise()
    if (res.status < 200 || res.status >= 300 || !res.data) {
      throw new Error(`Cannot GET ${url}`)
    }
    const dom = new JSDOM(res.data)
    const { document } = dom.window

    return await Promise.all(
      targets.map((target) => {
        const {
          cssSelector,
          attribute,
          type = TargetType.String,
          name,
          description,
        } = target

        const element = document.querySelector(cssSelector)
        const rawValue = attribute
          ? element?.getAttribute(attribute)
          : element?.textContent
        const value = this.parseRawValue(rawValue, type)

        return { cssSelector, attribute, type, value, name, description }
      })
    )
  }

  private parseRawValue(
    rawValue: string | null | undefined,
    type: TargetType
  ): string | number | null {
    if (rawValue === null || rawValue === undefined) {
      return null
    }
    if (type === TargetType.Number) {
      return parseFloat(rawValue)
    }
    return rawValue.trim()
  }
}
