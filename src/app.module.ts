import { Module } from '@nestjs/common';
import { ArticlesController } from './articles/articles.controller';
import { ArticlesService } from './articles/articles.service';
import { AuthGuard } from './guards/auth.guard';
import { TokensService } from './tokens/tokens.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

@Module({
  imports: [],
  controllers: [UsersController, ArticlesController],
  providers: [UsersService, TokensService, ArticlesService, AuthGuard],
})
export class AppModule {}
