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

  @Post()
  async post(@Body() body: ScrapeCommandDto): Promise<ScrapeResultDto> {
    const targets = await this.scraperService.scrape(
      body.url,
      body.targets ?? [],
      body.csr ?? false
    )
    return { targets }
  }
}
