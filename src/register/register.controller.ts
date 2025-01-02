import {
  Body,
  Controller,
  Param,
  Post,
  ValidationPipe,
  Get,
} from "@nestjs/common"
import { RegisterService } from "./register.service"
import { CreateUserDTO } from "./register.dto"

@Controller("register")
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  createUser(@Body(ValidationPipe) body: CreateUserDTO) {
    return this.registerService.createUser(body)
  }

  @Get(":code")
  confirmEmail(@Param("code") code: string) {
    return this.registerService.confirmEmail(code)
  }
}
