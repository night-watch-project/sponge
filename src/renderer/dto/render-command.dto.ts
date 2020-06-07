import { HttpProxy } from "../../common/types/http-proxy.class"

export class RenderCommandDto {
  url: string
  headers?: Record<string, string>
  httpProxy?: HttpProxy
}
