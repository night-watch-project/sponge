import { IsUrl } from "class-validator"
import { HttpProxy } from "../../common/types/http-proxy.class"
import { InputTarget } from "../types/input-target.class"

export class ScrapeCommandDto {
    @IsUrl()
    url: string

    targets?: InputTarget[] = []

    metadata?: boolean = false

    blockAds?: boolean = false

    forwardHeaders?: boolean = false

    httpProxy?: HttpProxy
}
