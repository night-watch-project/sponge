import { TargetType } from "./target-type.enum"
import { ApiProperty } from "@nestjs/swagger"

export class OutputTarget {
    @ApiProperty({ description: "Target name" })
    name?: string

    @ApiProperty({ description: "Target description" })
    description?: string

    @ApiProperty({ description: "CSS selector" })
    cssSelector: string

    @ApiProperty({ description: "Attribute name" })
    attribute?: string

    @ApiProperty({ description: "Data type" })
    type: TargetType

    @ApiProperty({ description: "Whether to scrape all matching elements" })
    multiple: boolean

    @ApiProperty({ description: "Target values" })
    values: Array<string | number | null>
}
