import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import { MailService } from "src/mail/mail.service"
import { JwtService } from "@nestjs/jwt"
import { LoginInterface } from "./auth.interface"
import { ChangePasswordDto, ResetPwdDto, RequestResetPwdDto } from "./auth.dto"
import { Request, Response } from "express"
import * as bcrypt from "bcrypt"
import * as crypto from "crypto"
import { generateRandomNumber } from "src/utils/random.generator"
import { addMinutes, isAfter } from "date-fns"

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
    private readonly jwt: JwtService,
  ) {}

  async login(req: Request, res: Response, body: LoginInterface) {
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
      throw new UnauthorizedException("Invalid credentials")
    }

    const pwdMatch = await bcrypt.compare(password, foundUser.password)
    if (!pwdMatch) {
      throw new UnauthorizedException("Invalid credentials")
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
      try {
        const code = generateRandomNumber(6)
        const expires_at = addMinutes(new Date(), 5)

        await this.prisma.verificationCodes.update({
          where: { user_id: foundUser.id },
          data: { code, expires_at },
        })

        this.mail.sendVerificationCode(foundUser.email, code)
        return res.status(206).send("We send confirmation code on your email.")
      } catch (err) {
        return res.status(500).send(err.message)
      }
    }

    const foundUserVerificationCode =
      await this.prisma.verificationCodes.findUnique({
        where: { user_id: foundUser.id },
      })

    if (!foundUserVerificationCode) {
      throw new NotFoundException()
    }

    if (isAfter(new Date(), foundUserVerificationCode.expires_at)) {
      throw new RequestTimeoutException("Verification code expired")
    }

    if (foundUserVerificationCode.code !== verificationCode) {
      throw new UnauthorizedException("Invalid credentials")
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

  async refresh(req: Request, res: Response) {
    if (!req.cookies?.jwt) {
      return res.sendStatus(204)
    }
    const token = req.cookies.jwt
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true })

    const payload = await this.jwt
      .verifyAsync(token, { secret: process.env.REFRESH_TOKEN })
      .catch(() => {
        throw new ForbiddenException()
      })

    const foundUser = await this.prisma.users.findUnique({
      where: { id: payload.userId },
    })
    if (!foundUser) {
      throw new ForbiddenException()
    }

    await this.prisma.jwtTokens.delete({
      where: { user_id_token: { user_id: foundUser.id, token } },
    })

    const accessToken = this.jwt.sign(
      { userId: foundUser.id, username: foundUser.username },
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

  async changePassword(req: Request, res: Response, body: ChangePasswordDto) {
    const { password, newPassword, verificationCode } = body
    if (password === newPassword) {
      throw new BadRequestException(
        "New password can not be equal to the old password",
      )
    }

    const foundUser = await this.prisma.users.findUnique({
      where: { id: req.userId },
    })
    if (!foundUser) {
      throw new UnauthorizedException()
    }

    const pwdMatch = await bcrypt.compare(password, foundUser.password)
    if (!pwdMatch) {
      throw new UnauthorizedException()
    }

    if (!verificationCode) {
      try {
        const code = generateRandomNumber(6)
        const expires_at = addMinutes(new Date(), 5)

        await this.prisma.verificationCodes.update({
          where: { user_id: foundUser.id },
          data: { code, expires_at },
        })

        this.mail.sendPasswordChange(foundUser.email, code)
        return res.status(206).send("We send confirmation code on your email.")
      } catch (err) {
        return res.status(500).send(err?.message)
      }
    }

    const foundUserVerificationCode =
      await this.prisma.verificationCodes.findUnique({
        where: { user_id: foundUser.id },
      })

    if (!foundUserVerificationCode) {
      throw new NotFoundException()
    }

    if (isAfter(new Date(), foundUserVerificationCode.expires_at)) {
      throw new RequestTimeoutException("Verification code expired")
    }

    if (foundUserVerificationCode.code !== verificationCode) {
      throw new UnauthorizedException("Invalid credentials")
    }

    await this.prisma.verificationCodes.update({
      where: { user_id: foundUser.id },
      data: { code: null, expires_at: null },
    })

    const hashedPwd = await bcrypt.hash(newPassword, 10)
    await this.prisma.users.update({
      where: { id: foundUser.id },
      data: { password: hashedPwd },
    })

    return res.sendStatus(200)
  }

  async requestResetPassword(res: Response, body: RequestResetPwdDto) {
    const { email } = body
    const foundUser = await this.prisma.users.findUnique({ where: { email } })
    if (!foundUser) {
      throw new NotFoundException()
    }

    try {
      const code = `${foundUser.id}${crypto.randomBytes(46).toString("hex")}`
      const expires_at = addMinutes(new Date(), 10)

      await this.prisma.verificationCodes.update({
        where: { user_id: foundUser.id },
        data: { code, expires_at },
      })
      this.mail.sendPasswordReset(email, code)

      return res.status(206).send("We send confirmation letter on your email.")
    } catch (err) {
      return res.status(500).send(err?.message)
    }
  }

  async resetPassword(code: string, body: ResetPwdDto) {
    const { newPassword } = body
    if (!code) {
      throw new BadRequestException()
    }

    const userId = code.slice(0, 36)
    const foundUser = await this.prisma.users.findUnique({
      where: { id: userId },
    })
    if (!foundUser) {
      throw new NotFoundException()
    }

    const foundUserVerificationCode =
      await this.prisma.verificationCodes.findUnique({
        where: { user_id: userId },
      })

    if (!foundUserVerificationCode) {
      throw new NotFoundException()
    }

    if (isAfter(new Date(), foundUserVerificationCode.expires_at)) {
      throw new RequestTimeoutException("Verification code expired")
    }

    if (foundUserVerificationCode.code !== code) {
      throw new UnauthorizedException("Invalid credentials")
    }

    if (!newPassword) {
      //redirect to client side
      throw new BadRequestException("Provide a new password")
    }

    if (bcrypt.compareSync(newPassword, foundUser.password)) {
      throw new BadRequestException(
        "New password can not be equal to the old password",
      )
    }

    await this.prisma.verificationCodes.update({
      where: { user_id: userId },
      data: { code: null, expires_at: null },
    })

    const hashedPwd = await bcrypt.hash(newPassword, 10)
    await this.prisma.users.update({
      where: { id: userId },
      data: { password: hashedPwd },
    })

    return "Success password reseted"
  }
}
