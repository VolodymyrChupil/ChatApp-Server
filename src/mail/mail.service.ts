import { Injectable } from "@nestjs/common"
import { MailerService } from "@nestjs-modules/mailer"
import {
  emailConfirmationTmp,
  passwordChangeTmp,
  verificationCodeTmp,
  passwordResetTmp,
} from "./mail.template"

@Injectable()
export class MailService {
  constructor(private readonly mailer: MailerService) {}

  sendEmailConfirmation(email: string, code: string) {
    this.mailer.sendMail({
      from: `ChatApp <${process.env.EMAIL_ADDRESS}>`,
      to: email,
      subject: "Email Confirmation",
      html: emailConfirmationTmp(email, code),
    })
  }

  sendVerificationCode(email: string, code: string) {
    this.mailer.sendMail({
      from: `ChatApp <${process.env.EMAIL_ADDRESS}>`,
      to: email,
      subject: "Verification Code",
      html: verificationCodeTmp(email, code),
    })
  }

  sendPasswordChange(email: string, code: string) {
    this.mailer.sendMail({
      from: `ChatApp <${process.env.EMAIL_ADDRESS}>`,
      to: email,
      subject: "Password Change",
      html: passwordChangeTmp(email, code),
    })
  }

  sendPasswordReset(email: string, code: string) {
    this.mailer.sendMail({
      from: `ChatApp <${process.env.EMAIL_ADDRESS}>`,
      to: email,
      subject: "Password Reset",
      html: passwordResetTmp(email, code),
    })
  }
}
