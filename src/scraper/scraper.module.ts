import { HttpModule, Module } from "@nestjs/common"
import { RendererModule } from "../renderer/renderer.module"
import { ScraperController } from "./scraper.controller"
import { ScraperService } from "./scraper.service"

@Module({
  imports: [
    HttpModule.register({ timeout: 10000, validateStatus: () => true }),
    RendererModule,
  ],
  controllers: [ScraperController],
  providers: [ScraperService],
})
export class ScraperModule {}
