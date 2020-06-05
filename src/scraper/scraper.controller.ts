import { Body, Controller, Get, Post } from "@nestjs/common"
import { IamDto } from "../common/dto/iam.dto"
import { ScrapeCommandDto } from "./dto/scrape-command.dto"
import { ScrapeResultDto } from "./dto/scrape-result.dto"
import { ScraperService } from "./scraper.service"

@Controller("scraper")
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Get()
  get(): IamDto {
    return { iam: "/scraper" }
  }

  @Post("csr")
  async postCSR(@Body() body: ScrapeCommandDto): Promise<ScrapeResultDto> {
    const targets = await this.scraperService.scrapeCSR(
      body.url,
      body.targets ?? [],
      body.headers,
      body.httpProxy
    )
    return { targets }
  }

  @Post("ssr")
  async postSSR(@Body() body: ScrapeCommandDto): Promise<ScrapeResultDto> {
    const targets = await this.scraperService.scrapeSSR(
      body.url,
      body.targets ?? [],
      body.headers,
      body.httpProxy
    )
    return { targets }
  }
}
