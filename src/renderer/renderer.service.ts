import {
    BadRequestException,
    HttpException,
    Inject,
    Injectable,
    HttpService,
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { firefox } from "playwright-firefox"
import type { FirefoxBrowser } from "playwright-firefox"
import { HeadlessBrowserProvider } from "../headless-browser/headless-browser.provider"
import { BlocklistProvider } from "../resources/blocklist.provider"

@Injectable()
export class RendererService {
    private readonly httpProxy: string | undefined
    private readonly httpProxyUrl: URL

    public constructor(
        private readonly http: HttpService,
        @Inject(BlocklistProvider.providerName) private readonly blocklist: Set<string>,
        @Inject(HeadlessBrowserProvider.providerName)
        private readonly browser: FirefoxBrowser,
        config: ConfigService
    ) {
        this.httpProxy = config.get<string>("HTTP_PROXY")
        this.httpProxyUrl = new URL(`http://${this.httpProxy}`)
    }

    public async renderCSR(
        url: string,
        blockAds: boolean,
        proxy: boolean,
        headers?: Record<string, string>
    ): Promise<string> {
        const browser =
            proxy && this.httpProxy
                ? await firefox.launch({
                      proxy: {
                          server: this.httpProxyUrl.origin,
                          username: this.httpProxyUrl.username,
                          password: this.httpProxyUrl.password,
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
        proxy: boolean,
        headers?: Record<string, string>
    ): Promise<string> {
        const res = await this.http
            .get(url, {
                headers,
                proxy:
                    proxy && this.httpProxy
                        ? {
                              host: this.httpProxyUrl.hostname,
                              port: Number(this.httpProxyUrl.port) || 80,
                              auth: {
                                  username: this.httpProxyUrl.username,
                                  password: this.httpProxyUrl.password,
                              },
                          }
                        : undefined,
            })
            .toPromise()
        if (res.status < 200 || res.status >= 300) {
            throw new HttpException(res.statusText, res.status)
        }
        return res.data
    }
}
