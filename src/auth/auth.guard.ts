import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Observable } from "rxjs"
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    if (!request.header("authorization")?.startsWith("Bearer ")) {
      return false
    }

    const token = request.header("authorization").split(" ")[1]
    try {
      const payload = this.jwt.verify(token, {
        secret: process.env.ACCESS_TOKEN,
      })
      request.userId = payload.userId

      return true
    } catch (err) {
      return false
    }
  }
}
