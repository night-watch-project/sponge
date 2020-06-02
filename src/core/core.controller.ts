import { Controller, Get } from "@nestjs/common"
import { IamDto } from "../common/dto/iam.dto"

@Controller()
export class CoreController {
  @Get()
  get(): IamDto {
    return { iam: "/index" }
  }
}
