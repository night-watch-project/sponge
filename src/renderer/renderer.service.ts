import { BadRequestException, HttpException, Inject, Injectable } from "@nestjs/common"
import axios from "axios"
import { firefox } from "playwright-firefox"
import type { FirefoxBrowser } from "playwright-firefox"
import { HeadlessBrowserProvider } from "../headless-browser/headless-browser.provider"
import { BlocklistProvider } from "../resources/blocklist.provider"

const {
    HTTP_PROXY_USERNAME,
    HTTP_PROXY_PASSWORD,
    HTTP_PROXY_HOST,
    HTTP_PROXY_PORT,
} = process.env

@Injectable()
export class RendererService {
    // temporarily use this axios instance until HttpService uses axios@0.20.x internally
    axios = axios.create({ timeout: 10000, validateStatus: () => true })

    public constructor(
        @Inject(BlocklistProvider.providerName) private readonly blocklist: Set<string>,
        @Inject(HeadlessBrowserProvider.providerName)
        private readonly browser: FirefoxBrowser
    ) {}

    public async renderCSR(
        url: string,
        blockAds: boolean,
        headers?: Record<string, string>,
        proxy?: boolean
    ): Promise<string> {
        const browser = proxy
            ? await firefox.launch({
                  proxy: {
                      server: `${HTTP_PROXY_HOST}:${HTTP_PROXY_PORT}`,
                      username: HTTP_PROXY_USERNAME,
                      password: HTTP_PROXY_PASSWORD,
                  },
              })
            : this.browser
        const context = await browser.newContext({
            extraHTTPHeaders: headers,
        })
        context.setDefaultTimeout(30000) // 30s
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
            const res = await page.goto(url)
            if (!res) {
                throw new BadRequestException()
            }
            if (!res.ok()) {
                throw new HttpException(res.statusText(), res.status())
            }
            const html = await page.innerHTML("html")
            return `<!DOCTYPE HTML>${html}`
        } finally {
            await context.close()
            if (proxy) {
                await browser.close()
            }
        }
    }

    public async renderSSR(
        url: string,
        headers?: Record<string, string>,
        proxy?: boolean
    ): Promise<string> {
        const res = await this.axios.get(url, {
            headers,
            proxy: proxy
                ? {
                      host: String(HTTP_PROXY_HOST),
                      port: Number(HTTP_PROXY_PORT),
                      auth: {
                          username: String(HTTP_PROXY_USERNAME),
                          password: String(HTTP_PROXY_PASSWORD),
                      },
                  }
                : undefined,
        })
        if (res.status < 200 || res.status >= 300) {
            throw new HttpException(res.statusText, res.status)
        }
        return res.data
    }
}
