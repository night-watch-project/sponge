import { OutputTarget } from "../types/output-target.class"

export class ScrapeResultDto {
  targets: OutputTarget[]
  metadata?: Record<string, unknown>
}
