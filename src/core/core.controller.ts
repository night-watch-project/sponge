import { Controller, Get, Redirect } from "@nestjs/common"

@Controller()
export class CoreController {
  @Get()
  @Redirect("/docs")
  get(): void {
    //
  }
}
