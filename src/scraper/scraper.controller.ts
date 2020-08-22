import { Body, Controller, Post } from "@nestjs/common"
import { ScrapeCommandDto } from "./dto/scrape-command.dto"
import { ScrapeResultDto } from "./dto/scrape-result.dto"
import { ScraperService } from "./scraper.service"

@Controller("v1/scraper")
export class ScraperController {
  constructor(private readonly scraper: ScraperService) {}

  @Post("csr")
  postCSR(@Body() body: ScrapeCommandDto): Promise<ScrapeResultDto> {
    return this.scraper.scrapeCSR(
      body.url,
      body.targets ?? [],
      body.metadata ?? false,
      body.blockAds ?? true,
      body.headers,
      body.httpProxy
    )
  }

  @Post("ssr")
  postSSR(@Body() body: ScrapeCommandDto): Promise<ScrapeResultDto> {
    return this.scraper.scrapeSSR(
      body.url,
      body.targets ?? [],
      body.metadata ?? false,
      body.headers,
      body.httpProxy
    )
  }
}
