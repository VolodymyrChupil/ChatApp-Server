import { IsEmail, IsStrongPassword, Length, MaxLength } from "class-validator"

export class CreateUserDTO {
  @Length(3, 32)
  username: string

  @MaxLength(64)
  @IsEmail()
  email: string

  @Length(12, 64)
  @IsStrongPassword()
  password: string
}
