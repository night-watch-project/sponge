import { Body, Controller, Get, Header, Headers, Post, Query, Res } from "@nestjs/common"
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
    async getCSR(
        @Headers() headers: Record<string, string>,
        @Query() query: RenderQueryDto,
        @Res() res: FastifyReply
    ): Promise<void> {
        const quotas = 5
        res.header(this.quotaCostHeader, `${this.quotaName}=${quotas}`).send(
            await this.renderer.renderCSR(
                query.url,
                query.blockAds ?? false,
                query.forwardHeaders ? headers : undefined
            )
        )
    }

    @Post("csr")
    @Header("Content-Type", "text/html; charset=UTF-8")
    async postCSR(
        @Headers() headers: Record<string, string>,
        @Body() body: RenderCommandDto,
        @Res() res: FastifyReply
    ): Promise<void> {
        const quotas = body.httpProxy ? 6 : 5
        res.header(this.quotaCostHeader, `${this.quotaName}=${quotas}`).send(
            await this.renderer.renderCSR(
                body.url,
                body.blockAds ?? false,
                body.forwardHeaders ? headers : undefined,
                body.httpProxy
            )
        )
    }

    @Get("ssr")
    @Header("Content-Type", "text/html; charset=UTF-8")
    async getSSR(
        @Headers() headers: Record<string, string>,
        @Query() query: RenderQueryDto,
        @Res() res: FastifyReply
    ): Promise<void> {
        const quotas = 1
        res.header(this.quotaCostHeader, `${this.quotaName}=${quotas}`).send(
            await this.renderer.renderSSR(
                query.url,
                query.forwardHeaders ? headers : undefined
            )
        )
    }

    @Post("ssr")
    @Header("Content-Type", "text/html; charset=UTF-8")
    async postSSR(
        @Headers() headers: Record<string, string>,
        @Body() body: RenderCommandDto,
        @Res() res: FastifyReply
    ): Promise<void> {
        const quotas = body.httpProxy ? 2 : 1
        res.header(this.quotaCostHeader, `${this.quotaName}=${quotas}`).send(
            await this.renderer.renderSSR(
                body.url,
                body.forwardHeaders ? headers : undefined,
                body.httpProxy
            )
        )
    }
}
