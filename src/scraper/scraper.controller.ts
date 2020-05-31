import { Body, Controller, Get, Post, Query } from "@nestjs/common"
import type { CommandScrapeDto } from "./dto/command-scrape.dto"
import type { OutputTarget } from "./interfaces/output-target.interface"
import { ScraperService } from "./scraper.service"

@Controller("scraper")
export class ScraperController {
  constructor(private readonly service: ScraperService) {}

  @Get()
  async scrapeWithGet(
    @Query() query: CommandScrapeDto
  ): Promise<{ targets: OutputTarget[] }> {
    const targets = await this.service.run(query.url, query.targets)
    return { targets }
  }

  @Post()
  async scrapeWithPost(
    @Body() body: CommandScrapeDto
  ): Promise<{ targets: OutputTarget[] }> {
    const targets = await this.service.run(body.url, body.targets)
    return { targets }
  }
}
