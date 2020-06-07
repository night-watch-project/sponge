import { Module } from "@nestjs/common"
import { HeadlessBrowserModule } from "../headless-browser/headless-browser.module"
import { RendererController } from "./renderer.controller"
import { RendererService } from "./renderer.service"

@Module({
  imports: [HeadlessBrowserModule],
  controllers: [RendererController],
  providers: [RendererService],
})
export class RendererModule {}
