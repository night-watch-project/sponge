import { Module } from "@nestjs/common"
import { RendererModule } from "../renderer/renderer.module"
import { ScraperController } from "./scraper.controller"
import { ScraperService } from "./scraper.service"

@Module({
  imports: [RendererModule],
  controllers: [ScraperController],
  providers: [ScraperService],
})
export class ScraperModule {}
