import { Injectable } from "@nestjs/common"
import { PrismaService } from "./prisma/prisma.service"
import { Request } from "express"

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getInfo(): string {
    return "ChatApp API"
  }

  async protected(req: Request) {
    const user = await this.prisma.users.findUnique({
      where: { id: req.userId },
    })

    return `You are logged in as ${user.username}`
  }
}
