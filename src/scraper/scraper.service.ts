import { HttpService, Injectable } from "@nestjs/common"
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
import { HttpProxy } from "../common/types/http-proxy.class"
import { RendererService } from "../renderer/renderer.service"
import type { ScrapeResultDto } from "./dto/scrape-result.dto"
import type { InputTarget } from "./types/input-target.class"
import type { OutputTarget } from "./types/output-target.class"
import { TargetType } from "./types/target-type.enum"
import { TargetItem } from "./types/target-item.class"

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
    private readonly rendererService: RendererService
  ) {}

  public async scrapeCSR(
    url: string,
    targets: InputTarget[],
    metadata: boolean,
    blockAds: boolean,
    headers?: Record<string, string>,
    proxy?: HttpProxy
  ): Promise<ScrapeResultDto> {
    const html = await this.rendererService.renderCSR(url, blockAds, headers, proxy)
    return this.scrapeWithHtml(url, targets, metadata, html)
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
    return this.scrapeWithHtml(url, targets, metadata, html)
  }

  private async scrapeWithHtml(
    url: string,
    targets: InputTarget[],
    metadata: boolean,
    html: string
  ): Promise<ScrapeResultDto> {
    const outputTargets = this.scrapeTargets(targets, html)
    const meta = metadata ? await this.scrapeMetadata(url, html) : undefined
    return { targets: outputTargets, metadata: meta }
  }

  private scrapeTargets(targets: InputTarget[], html: string): OutputTarget[] {
    const dom = new JSDOM(html)
    const { document } = dom.window

    return targets.map((target) => {
      const {
        cssSelector,
        attribute,
        type = TargetType.String,
        name,
        description,
        multiple,
      } = target
      let output: OutputTarget
      const values: TargetItem[] = []
      if (multiple) {
        const elements = document.querySelectorAll(cssSelector)
        elements.forEach((element, i) => {
          const value = this.scrapeElementValue(element, type, attribute)
          if (value) {
            values.push({ index: i, value: value })
          }
        })
        output = { cssSelector, attribute, type, values, name, description }
      } else {
        const element = document.querySelector(cssSelector)
        const value = this.scrapeElementValue(element, type, attribute)
        if (value) {
          values.push({ index: 0, value: value })
        }
        output = { cssSelector, attribute, type, values, name, description }
      }
      return output
    })
  }

  private async scrapeMetadata(
    url: string,
    html: string
  ): Promise<Record<string, unknown>> {
    return this.metaScraper({ url, html })
  }

  private scrapeElementValue(
    element: Element | null,
    type: TargetType,
    attribute?: string
  ) {
    const rawValue = attribute
      ? element?.getAttribute(attribute)
      : type === TargetType.Html
      ? element?.innerHTML
      : element?.textContent
    return this.parseRawValue(rawValue ?? null, type)
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
