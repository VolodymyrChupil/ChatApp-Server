import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  Get,
  UseGuards,
  ValidationPipe,
  Param,
  Patch,
} from "@nestjs/common"
import { AuthService } from "./auth.service"
import { LoginInterface } from "./auth.interface"
import { ChangePasswordDto, ResetPwdDto, RequestResetPwdDto } from "./auth.dto"
import { Request, Response } from "express"
import { Throttle, SkipThrottle } from "@nestjs/throttler"
import { AuthGuard } from "./auth.guard"

@Throttle({ default: { limit: 5 } })
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  login(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: LoginInterface,
  ) {
    return this.authService.login(req, res, body)
  }

  @SkipThrottle()
  @Get("logout")
  logout(@Req() req: Request, @Res() res: Response) {
    return this.authService.logout(req, res)
  }

  @SkipThrottle()
  @Get("refresh")
  refresh(@Req() req: Request, @Res() res: Response) {
    return this.authService.refresh(req, res)
  }

  @UseGuards(AuthGuard)
  @Post("change-pwd")
  changePassword(
    @Req() req: Request,
    @Res() res: Response,
    @Body(ValidationPipe) body: ChangePasswordDto,
  ) {
    return this.authService.changePassword(req, res, body)
  }

  @Post("reset-pwd")
  requestResetPassword(
    @Res() res: Response,
    @Body(ValidationPipe) body: RequestResetPwdDto,
  ) {
    return this.authService.requestResetPassword(res, body)
  }

  @Patch("reset-pwd/:code")
  resetPassword(
    @Param("code") code: string,
    @Body(ValidationPipe) body: ResetPwdDto,
  ) {
    return this.authService.resetPassword(code, body)
  }
}
