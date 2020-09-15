import { Injectable } from "@nestjs/common"
import { JSDOM } from "jsdom"
import metaScraper, { Metadata } from "metascraper"
import metaAudio from "metascraper-audio"
import metaAuthor from "metascraper-author"
import metaDate from "metascraper-date"
import metaDescription from "metascraper-description"
import metaIframe from "metascraper-iframe"
import metaImage from "metascraper-image"
import metaLang from "metascraper-lang"
import metaLogo from "metascraper-logo"
import metaLogoFavicon from "metascraper-logo-favicon"
import metaPublisher from "metascraper-publisher"
import metaReadability from "metascraper-readability"
import metaTitle from "metascraper-title"
import metaUrl from "metascraper-url"
import metaVideo from "metascraper-video"
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
        spoofUserAgent: boolean,
        proxy: boolean,
        headers?: Record<string, string>
    ): Promise<ScrapeResultDto> {
        const html = await this.renderer.renderCSR(
            url,
            blockAds,
            spoofUserAgent,
            proxy,
            headers
        )
        return this.scrapeWithHtml(url, targets, metadata, html)
    }

    public async scrapeSSR(
        url: string,
        targets: InputTarget[],
        metadata: boolean,
        spoofUserAgent: boolean,
        proxy: boolean,
        headers?: Record<string, string>
    ): Promise<ScrapeResultDto> {
        const html = await this.renderer.renderSSR(url, spoofUserAgent, proxy, headers)
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

    private async scrapeMetadata(url: string, html: string): Promise<Metadata> {
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
