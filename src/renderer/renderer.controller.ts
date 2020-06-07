import { Body, Controller, Get, Post } from "@nestjs/common"
import { IamDto } from "../common/dto/iam.dto"
import { RenderCommandDto } from "./dto/render-command.dto"
import { RendererService } from "./renderer.service"

@Controller("renderer")
export class RendererController {
  constructor(private readonly rendererService: RendererService) {}

  @Get()
  get(): IamDto {
    return { iam: "/renderer" }
  }

  @Post("csr")
  postCSR(@Body() body: RenderCommandDto): Promise<string> {
    return this.rendererService.renderCSR(body.url, body.headers, body.httpProxy)
  }
}
