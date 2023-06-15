import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum AccountRole {
  admin = 'admin',
  user = 'user',
}

export class RegistrationDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(AccountRole)
  role: AccountRole;
}

export class LoginDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ResetPasswordDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  old_password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  new_password: string;
}
