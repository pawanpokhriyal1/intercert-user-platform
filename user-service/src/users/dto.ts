import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;
}

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;
}

export class ChangePasswordDto {
  @IsString()
  oldPassword!: string;

  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, { message: 'new password must include at least one uppercase letter and one number' })
  newPassword!: string;
}
