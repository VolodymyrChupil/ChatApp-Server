import { Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { JwtModule } from "@nestjs/jwt"
import { PrismaModule } from "src/prisma/prisma.module"
import { MailModule } from "src/mail/mail.module"

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [JwtModule, PrismaModule, MailModule],
})
export class AuthModule {}
