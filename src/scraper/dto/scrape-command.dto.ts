import { InputTarget } from "../types/input-target.class"

export class ScrapeCommandDto {
  url: string
  targets?: InputTarget[] = []
  csr?: boolean = false
}
