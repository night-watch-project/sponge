import { Body, Controller, Get, Header, Post, Query } from "@nestjs/common"
import { RenderCommandDto } from "./dto/render-command.dto"
import { RenderQueryDto } from "./dto/render-query.dto"
import { RendererService } from "./renderer.service"

@Controller("v1/renderer")
export class RendererController {
  constructor(private readonly renderer: RendererService) {}

  @Get("csr")
  @Header("Content-Type", "text/html; charset=UTF-8")
  getCSR(@Query() query: RenderQueryDto): Promise<string> {
    return this.renderer.renderCSR(query.url, query.blockAds ?? true)
  }

  @Post("csr")
  @Header("Content-Type", "text/html; charset=UTF-8")
  postCSR(@Body() body: RenderCommandDto): Promise<string> {
    return this.renderer.renderCSR(
      body.url,
      body.blockAds ?? true,
      body.headers,
      body.httpProxy
    )
  }

  @Get("ssr")
  @Header("Content-Type", "text/html; charset=UTF-8")
  getSSR(@Query() query: RenderQueryDto): Promise<string> {
    return this.renderer.renderSSR(query.url)
  }

  @Post("ssr")
  @Header("Content-Type", "text/html; charset=UTF-8")
  postSSR(@Body() body: RenderCommandDto): Promise<string> {
    return this.renderer.renderSSR(body.url, body.headers, body.httpProxy)
  }
}
