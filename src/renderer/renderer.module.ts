import { Module } from "@nestjs/common"
import { HeadlessBrowserModule } from "../headless-browser/headless-browser.module"
import { ResourcesModule } from "../resources/resources.module"
import { RendererController } from "./renderer.controller"
import { RendererService } from "./renderer.service"

@Module({
  imports: [ResourcesModule, HeadlessBrowserModule],
  controllers: [RendererController],
  providers: [RendererService],
  exports: [RendererService],
})
export class RendererModule {}
