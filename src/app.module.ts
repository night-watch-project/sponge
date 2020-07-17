import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { RendererModule } from "./renderer/renderer.module"
import { ScraperModule } from "./scraper/scraper.module"

@Module({ imports: [RendererModule, ScraperModule], controllers: [AppController] })
export class AppModule {}
