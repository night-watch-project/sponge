import { Body, Controller, Post } from "@nestjs/common"
import { RenderCommandDto } from "./dto/render-command.dto"
import { RendererService } from "./renderer.service"

@Controller("v1/renderer")
export class RendererController {
  constructor(private readonly rendererService: RendererService) {}

  @Post("csr")
  postCSR(@Body() body: RenderCommandDto): Promise<string> {
    return this.rendererService.renderCSR(
      body.url,
      body.blockAds ?? true,
      body.headers,
      body.httpProxy
    )
  }
}
