import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { PrismaModule } from "./prisma/prisma.module"
import { LoggerMiddleware } from "./logger/logger.middleware"
import { ConfigModule } from "@nestjs/config"
import { RegisterModule } from "./register/register.module"
import { MailModule } from "./mail/mail.module"
import { MailerModule } from "@nestjs-modules/mailer"

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot(),
    RegisterModule,
    MailModule,
    MailerModule.forRoot({ transport: process.env.EMAIL_TRANSPORT }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL })
  }
}
