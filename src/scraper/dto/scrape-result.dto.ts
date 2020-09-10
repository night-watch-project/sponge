import { ApiProperty } from "@nestjs/swagger"
import { Metadata } from "metascraper"
import { OutputTarget } from "../types/output-target.class"

export class ScrapeResultDto {
    targets: OutputTarget[]

    @ApiProperty({ description: "Metadata and article content" })
    metadata?: Metadata
}
