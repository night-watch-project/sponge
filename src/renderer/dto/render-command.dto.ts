import { ApiProperty } from "@nestjs/swagger"
import { HttpProxy } from "../../common/types/http-proxy.class"

export class RenderCommandDto {
  url: string

  @ApiProperty({ type: "boolean" }) // manually annotated as @nestjs/swagger doesn't recognize boolean
  blockAds?: boolean = true

  headers?: Record<string, string>
  httpProxy?: HttpProxy
}
