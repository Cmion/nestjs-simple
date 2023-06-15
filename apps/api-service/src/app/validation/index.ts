import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

enum AccountRole {
  admin = 'admin',
  user = 'user',
}

export class RegistrationDTO {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsEnum(AccountRole)
  role: AccountRole;
}

export class LoginDTO {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
