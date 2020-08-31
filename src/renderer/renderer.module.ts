import { HttpModule, Module } from "@nestjs/common"
import { HeadlessBrowserModule } from "../headless-browser/headless-browser.module"
import { ResourcesModule } from "../resources/resources.module"
import { RendererController } from "./renderer.controller"
import { RendererService } from "./renderer.service"

@Module({
    imports: [
        HttpModule.register({ timeout: 10000, validateStatus: () => true }),
        ResourcesModule,
        HeadlessBrowserModule,
    ],
    controllers: [RendererController],
    providers: [RendererService],
    exports: [RendererService],
})
export class RendererModule {}
