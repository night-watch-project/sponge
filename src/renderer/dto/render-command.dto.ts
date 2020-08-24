import { IsUrl } from "class-validator"

export class RenderCommandDto {
    @IsUrl()
    url: string

    blockAds?: boolean = false

    forwardHeaders?: boolean = false

    httpProxy?: boolean = false
}
