import { HttpModule, Module } from "@nestjs/common"
import { HeadlessBrowser } from "./headless-browser.provider"
import { ScraperController } from "./scraper.controller"
import { ScraperService } from "./scraper.service"

@Module({
  imports: [HttpModule.register({ validateStatus: () => true })],
  controllers: [ScraperController],
  providers: [
    ScraperService,
    { provide: "HEADLESS_BROWSER", useFactory: () => HeadlessBrowser.launch() },
  ],
})
export class ScraperModule {}
