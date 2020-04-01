import { MinLength } from 'class-validator';

export class AuthenticateUserDto {
  @MinLength(1)
  login: string;

  @MinLength(1)
  password: string;
}
