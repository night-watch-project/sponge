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
import { UserAgentPoolProvider } from "../resources/user-agent-pool.provider"
import { UserAgentPool } from "../resources/types/user-agent-pool.class"

@Injectable()
export class RendererService {
    private readonly httpProxyUrl?: URL

    public constructor(
        private readonly http: HttpService,
        @Inject(BlocklistProvider.providerName) private readonly blocklist: Set<string>,
        @Inject(UserAgentPoolProvider.providerName)
        private readonly userAgentPool: UserAgentPool,
        @Inject(HeadlessBrowserProvider.providerName)
        private readonly browser: FirefoxBrowser,
        config: ConfigService
    ) {
        const httpProxy = config.get<string>("HTTP_PROXY")
        this.httpProxyUrl = httpProxy ? new URL(`http://${httpProxy}`) : undefined
    }

    public async renderCSR(
        url: string,
        blockAds: boolean,
        spoofUserAgent: boolean,
        proxy: boolean,
        headers?: Record<string, string>
    ): Promise<string> {
        const browser =
            proxy && this.httpProxyUrl
                ? await firefox.launch({
                      proxy: {
                          server: this.httpProxyUrl.origin,
                          username: this.httpProxyUrl.username,
                          password: this.httpProxyUrl.password,
                      },
                  })
                : this.browser
        const context = await browser.newContext({
            userAgent: spoofUserAgent ? this.userAgentPool.random() : undefined,
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
        spoofUserAgent: boolean,
        proxy: boolean,
        headers?: Record<string, string>
    ): Promise<string> {
        const res = await this.http
            .get(url, {
                headers: spoofUserAgent
                    ? { ...headers, "User-Agent": this.userAgentPool.random() }
                    : headers,
                proxy:
                    proxy && this.httpProxyUrl
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
