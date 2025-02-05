import {
  IsStrongPassword,
  Length,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  MaxLength,
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

export class ResetPwdDto {
  @Length(12, 64)
  @IsStrongPassword()
  newPassword: string
}

export class RequestResetPwdDto {
  @MaxLength(64)
  @IsEmail()
  email: string
}
