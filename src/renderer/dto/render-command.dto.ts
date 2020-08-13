import { IsUrl } from "class-validator"
import { HttpProxy } from "../../common/types/http-proxy.class"

export class RenderCommandDto {
  @IsUrl()
  url: string

  blockAds?: boolean = true
  headers?: Record<string, string>
  httpProxy?: HttpProxy
}
