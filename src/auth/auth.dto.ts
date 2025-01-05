import {
  IsStrongPassword,
  Length,
  IsNotEmpty,
  IsOptional,
} from "class-validator"

export class ChangePasswordDto {
  @IsNotEmpty()
  password: string

  @Length(12, 64)
  @IsStrongPassword()
  newPassword: string

  @IsOptional()
  verificationCode: string
}
