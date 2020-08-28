import { IsUrl } from "class-validator"
import { InputTarget } from "../types/input-target.class"
import { ApiProperty } from "@nestjs/swagger"

export class ScrapeCommandDto {
    @IsUrl()
    @ApiProperty({ description: "URL to scrape" })
    url: string

    targets?: InputTarget[] = []

    @ApiProperty({
        description: "Whether to automatically scrape metadata and article content",
    })
    metadata?: boolean = false

    @ApiProperty({ description: "Whether to block adware & malware domains" })
    blockAds?: boolean = false

    @ApiProperty({ description: "Whether to forward request headers" })
    forwardHeaders?: boolean = false

    @ApiProperty({ description: "Whether to use rotating HTTP proxies" })
    httpProxy?: boolean = false
}
