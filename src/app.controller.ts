import { Controller, Get, UseGuards, Req } from "@nestjs/common"
import { AppService } from "./app.service"
import { AuthGuard } from "./auth/auth.guard"
import { Request } from "express"

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getInfo(): string {
    return this.appService.getInfo()
  }

  @UseGuards(AuthGuard)
  @Get("protected")
  protected(@Req() req: Request) {
    return this.appService.protected(req)
  }
}
