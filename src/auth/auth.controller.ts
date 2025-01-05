import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  Get,
  UseGuards,
} from "@nestjs/common"
import { AuthService } from "./auth.service"
import { LoginInterface } from "./auth.interface"
import { ChangePasswordDto } from "./auth.dto"
import { Request, Response } from "express"
import { Throttle } from "@nestjs/throttler"
import { AuthGuard } from "./auth.guard"

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 5 } })
  @Post("login")
  login(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: LoginInterface,
  ) {
    return this.authService.login(req, res, body)
  }

  @Get("logout")
  logout(@Req() req: Request, @Res() res: Response) {
    return this.authService.logout(req, res)
  }

  @Get("refresh")
  refresh(@Req() req: Request, @Res() res: Response) {
    return this.authService.refresh(req, res)
  }

  @Throttle({ default: { limit: 5 } })
  @UseGuards(AuthGuard)
  @Post("change-pwd")
  changePassword(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: ChangePasswordDto,
  ) {
    return this.authService.changePassword(req, res, body)
  }
}
