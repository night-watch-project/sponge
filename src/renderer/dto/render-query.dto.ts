import { PickType } from "@nestjs/swagger"
import { RenderCommandDto } from "./render-command.dto"

export class RenderQueryDto extends PickType(RenderCommandDto, ["url", "blockAds"]) {}
