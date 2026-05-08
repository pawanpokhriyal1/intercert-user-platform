import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, { message: 'password must include at least one uppercase letter and one number' })
  password!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

export class ValidateDto {
  @IsString()
  token!: string;
}

export class InternalChangePasswordDto {
  @IsString()
  userId!: string;

  @IsString()
  oldPassword!: string;

  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, { message: 'new password must include at least one uppercase letter and one number' })
  newPassword!: string;
}
