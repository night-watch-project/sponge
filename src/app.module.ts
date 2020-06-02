import { Module } from "@nestjs/common"
import { CoreModule } from "./core/core.module"
import { ScraperModule } from "./scraper/scraper.module"

@Module({ imports: [CoreModule, ScraperModule] })
export class AppModule {}
