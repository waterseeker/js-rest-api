import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesController } from './articles.controller';
import { UsersService } from '../users/users.service';
import { ArticlesService } from './articles.service';
import { TokensService } from '../tokens/tokens.service';

describe('Articles Controller', () => {
  let controller: ArticlesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [UsersService, TokensService, ArticlesService],
    }).compile();

    controller = module.get<ArticlesController>(ArticlesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
