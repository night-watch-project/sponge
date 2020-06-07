import { Inject, Injectable } from "@nestjs/common"
import type { FirefoxBrowser } from "playwright-firefox"
import { HttpProxy } from "../common/types/http-proxy.class"
import { HeadlessBrowserProvider } from "../headless-browser/headless-browser.provider"

@Injectable()
export class RendererService {
  public constructor(
    @Inject(HeadlessBrowserProvider.providerName) private readonly browser: FirefoxBrowser
  ) {}

  public async renderCSR(
    url: string,
    headers?: Record<string, string>,
    proxy?: HttpProxy
  ): Promise<string> {
    const context = await this.browser.newContext({
      extraHTTPHeaders: headers,
    })
    context.setDefaultTimeout(10 * 1000) // 10s
    const page = await context.newPage()

    try {
      await page.goto(url)

      const htmlHandle = await page.$("html")
      const html = await htmlHandle?.innerHTML()
      if (!html) {
        throw new Error(`Cannot extract HTML from ${url}`)
      }
      return `<!DOCTYPE HTML>${html}`
    } finally {
      await page.close()
      await context.close()
    }
  }
}
