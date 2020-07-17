import { ApiProperty } from "@nestjs/swagger"
import { HttpProxy } from "../../common/types/http-proxy.class"
import { InputTarget } from "../types/input-target.class"

export class ScrapeCommandDto {
  url: string
  targets?: InputTarget[] = []

  @ApiProperty({ type: "boolean" }) // manually annotated as @nestjs/swagger doesn't recognize boolean
  metadata?: boolean = false

  @ApiProperty({ type: "boolean" })
  blockAds?: boolean = true

  headers?: Record<string, string>
  httpProxy?: HttpProxy
}
