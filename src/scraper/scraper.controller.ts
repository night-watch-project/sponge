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
  postCSR(@Body() body: ScrapeCommandDto): Promise<ScrapeResultDto> {
    return this.scraperService.scrapeCSR(
      body.url,
      body.targets ?? [],
      body.metadata ?? false,
      body.headers,
      body.httpProxy
    )
  }

  @Post("ssr")
  postSSR(@Body() body: ScrapeCommandDto): Promise<ScrapeResultDto> {
    return this.scraperService.scrapeSSR(
      body.url,
      body.targets ?? [],
      body.metadata ?? false,
      body.headers,
      body.httpProxy
    )
  }
}
