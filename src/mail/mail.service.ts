import { Injectable } from "@nestjs/common"
import { MailerService } from "@nestjs-modules/mailer"

@Injectable()
export class MailService {
  constructor(private readonly mailer: MailerService) {}

  sendEmailConfirmation(email: string, code: string) {
    this.mailer.sendMail({
      from: `ChatApp <${process.env.EMAIL_ADDRESS}>`,
      to: email,
      subject: "Email Confirmation",
      html: `To confirm yout email follow this <a href="${process.env.SERVER_URL}/register/${code}">link</a>`,
    })
  }

  sendVerificationCode(email: string, code: string) {
    this.mailer.sendMail({
      from: `ChatApp <${process.env.EMAIL_ADDRESS}>`,
      to: email,
      subject: "Verification Code",
      html: `Your code is : ${code}`,
    })
  }
}
