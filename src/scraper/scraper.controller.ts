import { Body, Controller, Get, Post, Query } from "@nestjs/common"
import { CommandScrapeDto } from "./dto/command-scrape.dto"
import { ScrapeResultDto } from "./dto/scrape-result.dto"
import { ScraperService } from "./scraper.service"

@Controller("scraper")
export class ScraperController {
  constructor(private readonly service: ScraperService) {}

  @Get()
  async scrapeWithGet(@Query() query: CommandScrapeDto): Promise<ScrapeResultDto> {
    const targets = await this.service.run(query.url, query.targets ?? [])
    return { targets }
  }

  @Post()
  async scrapeWithPost(@Body() body: CommandScrapeDto): Promise<ScrapeResultDto> {
    const targets = await this.service.run(body.url, body.targets ?? [])
    return { targets }
  }
}
