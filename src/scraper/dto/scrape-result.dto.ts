import { OutputTarget } from "../types/output-target.class"
import { ApiProperty } from "@nestjs/swagger"

export class ScrapeResultDto {
    targets: OutputTarget[]

    @ApiProperty({ description: "Metadata and article content" })
    metadata?: Record<string, unknown>
}
