import { HttpProxy } from "../../common/types/http-proxy.class"

export class RenderCommandDto {
  url: string
  blockAds?: boolean = true
  headers?: Record<string, string>
  httpProxy?: HttpProxy
}
