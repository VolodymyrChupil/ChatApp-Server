import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import { Request } from "express"
import { ProfileInfo } from "./profile.interface"

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfileInfo(id: string) {
    const foundUser = await this.prisma.users.findUnique({
      where: { id },
      select: { username: true, user_info: true },
    })

    if (!foundUser) {
      throw new NotFoundException("User not found")
    }

    return foundUser
  }

  async editProfileInfo(req: Request, body: ProfileInfo) {
    if (
      !body?.first_name &&
      !body?.last_name &&
      !body?.date_of_birth &&
      !body?.bio &&
      !body?.show_last_logged
    ) {
      throw new BadRequestException("Provide at least one profile property")
    }
    try {
      const foundUserInfo = await this.prisma.userInfo.update({
        where: { user_id: req.userId },
        data: {
          first_name: body?.first_name,
          last_name: body?.last_name,
          date_of_birth: body?.date_of_birth,
          bio: body?.bio,
          show_last_logged: body?.show_last_logged,
        },
      })
      return foundUserInfo
    } catch (err) {
      throw new ServiceUnavailableException(err)
    }
  }
}
