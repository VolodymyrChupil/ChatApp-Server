import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import { MailService } from "src/mail/mail.service"
import { JwtService } from "@nestjs/jwt"
import { LoginBody } from "./auth.interface"
import { Request, Response } from "express"
import * as bcrypt from "bcrypt"
import { generateNumber } from "src/utils/generator"
import { addMinutes, compareAsc } from "date-fns"

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
    private readonly jwt: JwtService,
  ) {}

  async login(req: Request, res: Response, body: LoginBody) {
    const cookies = req.cookies
    const { username, password, verificationCode } = body
    if (!username || !password) {
      throw new BadRequestException(
        "You must provide username and password to log in",
      )
    }

    const foundUser = await this.prisma.users.findUnique({
      where: { username },
    })
    if (!foundUser) {
      throw new UnauthorizedException()
    }

    const pwdMatch = await bcrypt.compare(password, foundUser.password)
    if (!pwdMatch) {
      throw new UnauthorizedException()
    }

    if (!foundUser.email_confirmed) {
      this.mail.sendEmailConfirmation(
        foundUser.email,
        foundUser.email_confirmation_code,
      )
      throw new BadRequestException(
        "You must confirm your email to log in! Check your email.",
      )
    }

    if (!verificationCode) {
      const code = generateNumber(8)
      const expires_at = addMinutes(new Date(), 5)

      await this.prisma.verificationCodes.update({
        where: { user_id: foundUser.id },
        data: { code, expires_at },
      })

      this.mail.sendVerificationCode(foundUser.email, code)
      return res.status(206).send("We send confirmation code on your email.")
    }

    const foundUserVerificationCode =
      await this.prisma.verificationCodes.findUnique({
        where: { user_id: foundUser.id },
      })

    if (compareAsc(new Date(), foundUserVerificationCode.expires_at) !== -1) {
      throw new RequestTimeoutException("Verification code expired")
    }

    if (foundUserVerificationCode.code !== verificationCode) {
      throw new UnauthorizedException("Verification code not valid")
    }

    await this.prisma.verificationCodes.update({
      where: { user_id: foundUser.id },
      data: { code: null, expires_at: null },
    })

    const refreshTokens = await this.prisma.jwtTokens.findMany({
      where: { user_id: foundUser.id },
    })
    if (refreshTokens.length >= 5) {
      await this.prisma.jwtTokens.deleteMany({
        where: { user_id: foundUser.id },
      })
    }

    if (cookies.jwt) {
      await this.jwt
        .verifyAsync(cookies.jwt, { secret: process.env.REFRESH_TOKEN })
        .then(async (payload) => {
          await this.prisma.jwtTokens.delete({
            where: {
              user_id_token: {
                user_id: payload.userId,
                token: cookies.jwt,
              },
            },
          })
        })
        .catch(() => {})
    }

    const accessToken = this.jwt.sign(
      { userId: foundUser.id, username },
      { secret: process.env.ACCESS_TOKEN, expiresIn: "15m" },
    )

    const newRefreshToken = this.jwt.sign(
      { userId: foundUser.id },
      { secret: process.env.REFRESH_TOKEN, expiresIn: "1d" },
    )

    await this.prisma.jwtTokens.create({
      data: {
        user_id: foundUser.id,
        token: newRefreshToken,
        ip: req.ip,
        user_agent: req.header("user-agent"),
      },
    })

    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    })

    return res.json({ accessToken })
  }

  async logout(req: Request, res: Response) {
    if (!req.cookies?.jwt) {
      return res.sendStatus(204)
    }
    const token = req.cookies.jwt
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true })

    try {
      const payload = await this.jwt.verifyAsync(token, {
        secret: process.env.REFRESH_TOKEN,
      })
      await this.prisma.jwtTokens.delete({
        where: { user_id_token: { user_id: payload.userId, token } },
      })
    } finally {
      return res.sendStatus(204)
    }
  }
}
