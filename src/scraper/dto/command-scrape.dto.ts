import { InputTarget } from "../classes/input-target.class"

export class CommandScrapeDto {
  url: string
  targets?: InputTarget[] = []
  csr?: boolean = false
}
