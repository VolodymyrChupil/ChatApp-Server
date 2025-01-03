import { Controller, Post, Body, Req, Res } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { LoginBody } from "./auth.interface"
import { Request, Response } from "express"

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  login(@Req() req: Request, @Res() res: Response, @Body() body: LoginBody) {
    return this.authService.login(req, res, body)
  }
}
