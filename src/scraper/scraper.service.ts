import { HttpService, Inject, Injectable } from "@nestjs/common"
import { JSDOM } from "jsdom"
import type { FirefoxBrowser } from "playwright-firefox"
import { HttpProxy } from "./types/http-proxy.class"
import type { InputTarget } from "./types/input-target.class"
import type { OutputTarget } from "./types/output-target.class"
import { TargetType } from "./types/target-type.enum"

@Injectable()
export class ScraperService {
  public constructor(
    private readonly httpService: HttpService,
    @Inject("HEADLESS_BROWSER") private readonly browser: FirefoxBrowser
  ) {}

  public async scrapeCSR(
    url: string,
    targets: InputTarget[],
    headers?: Record<string, string>,
    proxy?: HttpProxy
  ): Promise<OutputTarget[]> {
    const context = await this.browser.newContext({
      extraHTTPHeaders: headers,
    })
    context.setDefaultTimeout(10 * 1000) // 10s
    const page = await context.newPage()

    try {
      await page.goto(url)

      // wait for all targets to be visible
      await Promise.all(targets.map((target) => page.waitForSelector(target.cssSelector)))

      const htmlHandle = await page.$("html")
      const html = await htmlHandle?.innerHTML()
      if (!html) {
        throw new Error(`Cannot extract HTML from ${url}`)
      }
      return this.scrapeHtml(html, targets)
    } finally {
      await page.close()
      await context.close()
    }
  }

  public async scrapeSSR(
    url: string,
    targets: InputTarget[],
    headers?: Record<string, string>,
    proxy?: HttpProxy
  ): Promise<OutputTarget[]> {
    const res = await this.httpService
      .get(url, { timeout: 10 * 1000, headers, proxy })
      .toPromise()
    if (res.status < 200 || res.status >= 300 || !res.data) {
      throw new Error(`Cannot send GET ${url}`)
    }
    return this.scrapeHtml(res.data, targets)
  }

  private scrapeHtml(html: string, targets: InputTarget[]): OutputTarget[] {
    if (!targets.length) {
      return [{ cssSelector: "html", type: TargetType.Html, value: html }]
    }

    const dom = new JSDOM(html)
    const { document } = dom.window

    return targets.map((target) => {
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
        : type === TargetType.Html
        ? element?.innerHTML
        : element?.textContent
      const value = this.parseRawValue(rawValue ?? null, type)

      return { cssSelector, attribute, type, value, name, description }
    })
  }

  private parseRawValue(
    rawValue: string | null,
    type: TargetType
  ): string | number | null {
    if (rawValue === null) {
      return null
    }
    if (type === TargetType.Number) {
      return parseFloat(rawValue)
    }
    return rawValue.trim()
  }
}
