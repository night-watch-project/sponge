import { Injectable } from "@nestjs/common"
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

@Injectable()
export class ScraperService {
    private readonly metaScraper = metaScraper([
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

    public constructor(private readonly renderer: RendererService) {}

    public async scrapeCSR(
        url: string,
        targets: InputTarget[],
        metadata: boolean,
        blockAds: boolean,
        headers?: Record<string, string>,
        proxy?: HttpProxy
    ): Promise<ScrapeResultDto> {
        const html = await this.renderer.renderCSR(url, blockAds, headers, proxy)
        return this.scrapeWithHtml(url, targets, metadata, html)
    }

    public async scrapeSSR(
        url: string,
        targets: InputTarget[],
        metadata: boolean,
        headers?: Record<string, string>,
        proxy?: HttpProxy
    ): Promise<ScrapeResultDto> {
        const html = await this.renderer.renderSSR(url, headers, proxy)
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
                name,
                description,
                cssSelector,
                attribute,
                type = TargetType.String,
                multiple = false,
            } = target

            let elements = Array.from(document.querySelectorAll(cssSelector))
            if (!multiple) {
                elements = elements.slice(0, 1)
            }
            const values = elements.map((element) => {
                return this.scrapeElement(element, type, attribute)
            })
            return { name, description, cssSelector, attribute, type, multiple, values }
        })
    }

    private async scrapeMetadata(
        url: string,
        html: string
    ): Promise<Record<string, unknown>> {
        return this.metaScraper({ url, html })
    }

    private scrapeElement(element: Element, type: TargetType, attribute?: string) {
        const rawValue = attribute
            ? element.getAttribute(attribute)
            : type === TargetType.Html
            ? element.innerHTML
            : element.textContent
        return this.parseRawValue(rawValue, type)
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
