import { IsUrl } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class RenderCommandDto {
    @IsUrl()
    @ApiProperty({ description: "URL to scrape" })
    url: string

    @ApiProperty({ description: "Whether to block adware & malware domains" })
    blockAds?: boolean = false

    @ApiProperty({ description: "Whether to forward request headers" })
    forwardHeaders?: boolean = false

    @ApiProperty({ description: "Whether to spoof user-agent" })
    spoofUserAgent?: boolean = false

    @ApiProperty({ description: "Whether to use rotating HTTP proxies" })
    httpProxy?: boolean = false
}
