import { HttpModule, Module } from "@nestjs/common"
import { BlocklistModule } from "../blocklist/blocklist.module"
import { HeadlessBrowserModule } from "../headless-browser/headless-browser.module"
import { ScraperController } from "./scraper.controller"
import { ScraperService } from "./scraper.service"

@Module({
  imports: [
    BlocklistModule,
    HeadlessBrowserModule,
    HttpModule.register({ timeout: 10000, validateStatus: () => true }),
  ],
  controllers: [ScraperController],
  providers: [ScraperService],
})
export class ScraperModule {}
