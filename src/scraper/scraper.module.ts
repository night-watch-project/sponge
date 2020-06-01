import { HttpModule, Module } from "@nestjs/common"
import { ScraperController } from "./scraper.controller"
import { ScraperService } from "./scraper.service"

@Module({
  imports: [HttpModule.register({ validateStatus: () => true })],
  controllers: [ScraperController],
  providers: [ScraperService],
})
export class ScraperModule {}
