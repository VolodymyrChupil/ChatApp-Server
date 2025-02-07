import {
  Controller,
  Get,
  Patch,
  UseGuards,
  Param,
  Body,
  Req,
} from "@nestjs/common"
import { ProfileService } from "./profile.service"
import { AuthGuard } from "src/auth/auth.guard"
import { Request } from "express"
import { ProfileInfo } from "./profile.interface"

@Controller("profile")
@UseGuards(AuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(":id")
  getProfileInfo(@Param("id") id: string) {
    return this.profileService.getProfileInfo(id)
  }

  @Patch()
  editProfileInfo(@Req() req: Request, @Body() body: ProfileInfo) {
    return this.profileService.editProfileInfo(req, body)
  }
}
