import { HttpService, Inject, Injectable } from "@nestjs/common"
import metaReadability from "@night-watch-project/metascraper-readability"
import { JSDOM } from "jsdom"
import * as metaScraper from "metascraper"
import * as metaAudio from "metascraper-audio"
import * as metaAuthor from "metascraper-author"
import * as metaDate from "metascraper-date"
import * as metaDescription from "metascraper-description"
import * as metaIframe from "metascraper-iframe"
import * as metaImage from "metascraper-image"
import * as metaLang from "metascraper-lang"
import * as metaLogo from "metascraper-logo"
import * as metaLogoFavicon from "metascraper-logo-favicon"
import * as metaPublisher from "metascraper-publisher"
import * as metaTitle from "metascraper-title"
import * as metaUrl from "metascraper-url"
import * as metaVideo from "metascraper-video"
import type { FirefoxBrowser } from "playwright-firefox"
import { BlocklistProvider } from "../blocklist/blocklist.provider"
import { HttpProxy } from "../common/types/http-proxy.class"
import { HeadlessBrowserProvider } from "../headless-browser/headless-browser.provider"
import type { ScrapeResultDto } from "./dto/scrape-result.dto"
import type { InputTarget } from "./types/input-target.class"
import type { OutputTarget } from "./types/output-target.class"
import { TargetType } from "./types/target-type.enum"

@Injectable()
export class ScraperService {
  private metaScraper = metaScraper([
    metaAudio(),
    metaAuthor(),
    metaDate(),
    metaDescription(),
    metaIframe(),
    metaImage(),
    metaLang(),
    metaLogo(),
    metaLogoFavicon(),
    metaPublisher(),
    metaReadability(),
    metaTitle(),
    metaUrl(),
    metaVideo(),
  ])

  public constructor(
    private readonly httpService: HttpService,
    @Inject(BlocklistProvider.providerName) private readonly blocklist: Set<string>,
    @Inject(HeadlessBrowserProvider.providerName) private readonly browser: FirefoxBrowser
  ) {}

  public async scrapeCSR(
    url: string,
    targets: InputTarget[],
    metadata: boolean,
    blockAds: boolean,
    headers?: Record<string, string>,
    proxy?: HttpProxy
  ): Promise<ScrapeResultDto> {
    const context = await this.browser.newContext({
      extraHTTPHeaders: headers,
    })
    context.setDefaultTimeout(10 * 1000) // 10s
    if (blockAds) {
      context.route("**", (route) => {
        const url = new URL(route.request().url())
        if (this.blocklist.has(url.hostname)) {
          route.abort()
        } else {
          route.continue()
        }
      })
    }
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
      const outputTargets = this.scrapeHtml(html, targets)
      const meta = metadata ? await this.scrapeMetadata(url, html) : undefined

      return { targets: outputTargets, metadata: meta }
    } finally {
      await context.close()
    }
  }

  public async scrapeSSR(
    url: string,
    targets: InputTarget[],
    metadata: boolean,
    headers?: Record<string, string>,
    proxy?: HttpProxy
  ): Promise<ScrapeResultDto> {
    const res = await this.httpService
      .get(url, {
        timeout: 10 * 1000,
        headers,
        proxy: proxy
          ? {
              host: proxy.host,
              port: proxy.port,
              auth:
                proxy.username && proxy.password
                  ? {
                      username: proxy.username,
                      password: proxy.password,
                    }
                  : undefined,
            }
          : undefined,
      })
      .toPromise()
    if (res.status < 200 || res.status >= 300 || !res.data) {
      throw new Error(`Cannot send GET ${url}`)
    }
    const html = res.data
    const outputTargets = this.scrapeHtml(html, targets)
    const meta = metadata ? await this.scrapeMetadata(url, html) : undefined

    return { targets: outputTargets, metadata: meta }
  }

  private scrapeHtml(html: string, targets: InputTarget[]): OutputTarget[] {
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

  private async scrapeMetadata(
    url: string,
    html: string
  ): Promise<Record<string, unknown>> {
    return this.metaScraper({ url, html })
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
