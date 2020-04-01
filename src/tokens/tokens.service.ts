import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ActiveTokens } from './active-tokens.entity';
import { User } from '../users/user.entity';

@Injectable()
export class TokensService {
  private readonly activeTokens: ActiveTokens = {};

  create(user: User): string {
    const token = uuidv4();

    this.activeTokens[token] = user.userId;

    return token;
  }

  remove(token: string): void {
    delete this.activeTokens[token];
  }

  getTokenData(token: string): string {
    return this.activeTokens[token];
  }
}
