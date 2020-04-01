import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { TokensService } from '../tokens/tokens.service';

@Injectable()
export class UsersService {
  constructor(private readonly tokensService: TokensService) {}

  private readonly users: User[] = [];

  create(createUserDto: CreateUserDto) {
    const user = new User();

    user.login = createUserDto.login;
    user.password = createUserDto.password;
    user.userId = createUserDto.userId;

    this.users.push(user);
  }

  findOneByLogin(login: string): User {
    return this.users.find(user => user.login === login);
  }

  findOneByToken(token: string): User | null {
    const userId = this.tokensService.getTokenData(token);

    return this.users.find(user => user.userId === userId);
  }
}
