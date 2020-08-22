import { Body, Controller, Post, Res } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { ApiCreatedResponse } from "@nestjs/swagger"
import type { FastifyReply } from "fastify"
import { ScrapeCommandDto } from "./dto/scrape-command.dto"
import { ScrapeResultDto } from "./dto/scrape-result.dto"
import { ScraperService } from "./scraper.service"

@Controller("v1/scraper")
export class ScraperController {
  private readonly quotaCostHeader: string
  private readonly quotaName: string

  constructor(config: ConfigService, private readonly scraper: ScraperService) {
    this.quotaCostHeader = config.get<string>("QUOTA_COST_HEADER") as string
    this.quotaName = config.get<string>("QUOTA_NAME", "Credits")
  }

  @Post("csr")
  @ApiCreatedResponse({ type: ScrapeResultDto })
  async postCSR(@Body() body: ScrapeCommandDto, @Res() res: FastifyReply): Promise<void> {
    const quotas = body.httpProxy ? 6 : 5
    res
      .header(this.quotaCostHeader, `${this.quotaName}=${quotas}`)
      .send(
        await this.scraper.scrapeCSR(
          body.url,
          body.targets ?? [],
          body.metadata ?? false,
          body.blockAds ?? true,
          body.headers,
          body.httpProxy
        )
      )
  }

  @Post("ssr")
  @ApiCreatedResponse({ type: ScrapeResultDto })
  async postSSR(@Body() body: ScrapeCommandDto, @Res() res: FastifyReply): Promise<void> {
    const quotas = body.httpProxy ? 2 : 1
    res
      .header(this.quotaCostHeader, `${this.quotaName}=${quotas}`)
      .send(
        await this.scraper.scrapeSSR(
          body.url,
          body.targets ?? [],
          body.metadata ?? false,
          body.headers,
          body.httpProxy
        )
      )
  }
}
