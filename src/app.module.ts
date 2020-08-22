import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { AppController } from "./app.controller"
import { RendererModule } from "./renderer/renderer.module"
import { ScraperModule } from "./scraper/scraper.module"

const { NODE_ENV } = process.env

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `.env.${NODE_ENV}`, isGlobal: true }),
    RendererModule,
    ScraperModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
