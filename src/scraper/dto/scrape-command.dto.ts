import { InputTarget } from "../classes/input-target.class"

export class ScrapeCommandDto {
  url: string
  targets?: InputTarget[] = []
  csr?: boolean = false
}
