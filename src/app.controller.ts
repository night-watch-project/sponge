import { Controller, Get, Redirect } from "@nestjs/common"
import { ApiResponse } from "@nestjs/swagger"

@Controller()
export class AppController {
  @Get()
  @Redirect("/docs")
  @ApiResponse({ status: 302, description: "Redirect to /docs" })
  get(): void {}
}
