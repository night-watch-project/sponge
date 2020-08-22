import { Body, Controller, Get, Header, Post, Query, Res } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import type { FastifyReply } from "fastify"
import { RenderCommandDto } from "./dto/render-command.dto"
import { RenderQueryDto } from "./dto/render-query.dto"
import { RendererService } from "./renderer.service"

@Controller("v1/renderer")
export class RendererController {
  private readonly quotaCostHeader: string
  private readonly quotaName: string

  constructor(config: ConfigService, private readonly renderer: RendererService) {
    this.quotaCostHeader = config.get<string>("QUOTA_COST_HEADER") as string
    this.quotaName = config.get<string>("QUOTA_NAME", "Credits")
  }

  @Get("csr")
  @Header("Content-Type", "text/html; charset=UTF-8")
  async getCSR(@Query() query: RenderQueryDto, @Res() res: FastifyReply): Promise<void> {
    const quotas = 5
    res
      .header(this.quotaCostHeader, `${this.quotaName}=${quotas}`)
      .send(await this.renderer.renderCSR(query.url, query.blockAds ?? true))
  }

  @Post("csr")
  @Header("Content-Type", "text/html; charset=UTF-8")
  async postCSR(@Body() body: RenderCommandDto, @Res() res: FastifyReply): Promise<void> {
    const quotas = body.httpProxy ? 6 : 5
    res
      .header(this.quotaCostHeader, `${this.quotaName}=${quotas}`)
      .send(
        await this.renderer.renderCSR(
          body.url,
          body.blockAds ?? true,
          body.headers,
          body.httpProxy
        )
      )
  }

  @Get("ssr")
  @Header("Content-Type", "text/html; charset=UTF-8")
  async getSSR(@Query() query: RenderQueryDto, @Res() res: FastifyReply): Promise<void> {
    const quotas = 1
    res
      .header(this.quotaCostHeader, `${this.quotaName}=${quotas}`)
      .send(await this.renderer.renderSSR(query.url))
  }

  @Post("ssr")
  @Header("Content-Type", "text/html; charset=UTF-8")
  async postSSR(@Body() body: RenderCommandDto, @Res() res: FastifyReply): Promise<void> {
    const quotas = body.httpProxy ? 2 : 1
    res
      .header(this.quotaCostHeader, `${this.quotaName}=${quotas}`)
      .send(await this.renderer.renderSSR(body.url, body.headers, body.httpProxy))
  }
}
