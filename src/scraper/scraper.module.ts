import { HttpModule, Module } from "@nestjs/common"
import { HeadlessBrowserModule } from "../headless-browser/headless-browser.module"
import { ScraperController } from "./scraper.controller"
import { ScraperService } from "./scraper.service"

@Module({
  imports: [HttpModule.register({ validateStatus: () => true }), HeadlessBrowserModule],
  controllers: [ScraperController],
  providers: [ScraperService],
})
export class ScraperModule {}
