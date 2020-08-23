import { IsUrl } from "class-validator"
import { HttpProxy } from "../../common/types/http-proxy.class"

export class RenderCommandDto {
    @IsUrl()
    url: string

    blockAds?: boolean = false

    forwardHeaders?: boolean = false

    httpProxy?: HttpProxy
}
