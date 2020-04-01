import { AuthGuard } from './auth.guard';
import { UsersService } from '../users/users.service';
import { TestingModule, Test } from '@nestjs/testing';
import { TokensService } from '../tokens/tokens.service';

describe('AuthGuard', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, TokensService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(new AuthGuard(service)).toBeDefined();
  });
});
