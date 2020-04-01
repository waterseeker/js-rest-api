import { MinLength } from 'class-validator';

export class User {
  @MinLength(1)
  userId: string;

  @MinLength(1)
  login: string;

  @MinLength(1)
  password: string;
}
