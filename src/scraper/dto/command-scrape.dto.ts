import type { InputTarget } from "../interfaces/input-target.interface"

export interface CommandScrapeDto {
  url: string
  targets: InputTarget[]
  csr?: boolean
}
