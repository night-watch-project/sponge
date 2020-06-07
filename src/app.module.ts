import { Module } from "@nestjs/common"
import { CoreModule } from "./core/core.module"
import { RendererModule } from "./renderer/renderer.module"
import { ScraperModule } from "./scraper/scraper.module"

@Module({ imports: [CoreModule, RendererModule, ScraperModule] })
export class AppModule {}
