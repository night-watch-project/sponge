import { Body, Controller, Get, Post } from "@nestjs/common"
import { CommandScrapeDto } from "./dto/command-scrape.dto"
import { ScrapeResultDto } from "./dto/scrape-result.dto"
import { ScraperService } from "./scraper.service"

@Controller("scraper")
export class ScraperController {
  constructor(private readonly service: ScraperService) {}

  @Get()
  get(): { iam: "/scraper" } {
    return { iam: "/scraper" }
  }

  @Post()
  async post(@Body() body: CommandScrapeDto): Promise<ScrapeResultDto> {
    const targets = await this.service.run(body.url, body.targets ?? [])
    return { targets }
  }
}
