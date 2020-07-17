import { Module } from "@nestjs/common"
import { BlocklistModule } from "../blocklist/blocklist.module"
import { HeadlessBrowserModule } from "../headless-browser/headless-browser.module"
import { RendererController } from "./renderer.controller"
import { RendererService } from "./renderer.service"

@Module({
  imports: [BlocklistModule, HeadlessBrowserModule],
  controllers: [RendererController],
  providers: [RendererService],
  exports: [RendererService],
})
export class RendererModule {}
