import { HttpProxy } from "../../common/types/http-proxy.class"
import { InputTarget } from "../types/input-target.class"

export class ScrapeCommandDto {
  url: string
  targets?: InputTarget[] = []
  metadata?: boolean = false
  blockAds?: boolean = true
  headers?: Record<string, string>
  httpProxy?: HttpProxy
}
