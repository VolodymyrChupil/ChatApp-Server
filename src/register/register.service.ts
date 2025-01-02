import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common"
import { CreateUserDTO } from "./register.dto"
import { PrismaService } from "src/prisma/prisma.service"
import * as bcrypt from "bcrypt"
import * as crypto from "crypto"
import { MailService } from "src/mail/mail.service"

@Injectable()
export class RegisterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
  ) {}

  async createUser(body: CreateUserDTO) {
    const { username, email, password } = body

    const duplicateEmail = await this.prisma.users.findUnique({
      where: { email },
    })
    if (duplicateEmail) {
      throw new ConflictException("This email already taken!")
    }

    const duplicateUsername = await this.prisma.users.findUnique({
      where: { username },
    })
    if (duplicateUsername) {
      throw new ConflictException("This username already taken!")
    }

    try {
      const hashedPwd = await bcrypt.hash(password, 10)

      await this.prisma.$transaction(async (prisma) => {
        const user = await prisma.users.create({
          data: {
            username,
            email,
            password: hashedPwd,
            user_info: {
              create: {},
            },
            verification_code: {
              create: {},
            },
          },
        })

        const confirmationCode = `${user.id}${crypto.randomBytes(46).toString("hex")}`
        await prisma.users.update({
          where: { email },
          data: {
            email_confirmation_code: confirmationCode,
          },
        })

        this.mail.sendEmailConfirmation(email, confirmationCode)
        return `Success, user: ${username} created. We send confirmation letter on your email.`
      })
    } catch (err) {
      throw new ServiceUnavailableException()
    }
  }

  async confirmEmail(code: string) {
    if (!code) throw new BadRequestException()
    const userId = code.slice(0, 36)
    const foundUser = await this.prisma.users.findUnique({
      where: { id: userId },
    })

    if (!foundUser) {
      throw new NotFoundException()
    }
    if (foundUser.email_confirmation_code !== code) {
      throw new NotFoundException()
    }

    await this.prisma.users.update({
      where: { id: userId },
      data: { email_confirmed: true, email_confirmation_code: null },
    })

    return "Success, email confirmed! You can close this page."
  }
}
