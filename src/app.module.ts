import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { PrismaModule } from "./prisma/prisma.module"
import { LoggerMiddleware } from "./common/middleware/logger.middleware"
import { ConfigModule } from "@nestjs/config"
import { RegisterModule } from "./register/register.module"
import { MailModule } from "./mail/mail.module"
import { MailerModule } from "@nestjs-modules/mailer"
import { AuthModule } from "./auth/auth.module"
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler"
import { APP_GUARD, APP_FILTER } from "@nestjs/core"
import { JwtModule } from "@nestjs/jwt"
import { GlobalExceptionFilter } from "./common/filters/global-exception.filter"
@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot(),
    RegisterModule,
    MailModule,
    MailerModule.forRoot({ transport: process.env.EMAIL_TRANSPORT }),
    AuthModule,
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
    JwtModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL })
  }
}
