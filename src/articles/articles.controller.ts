import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { HttpErrorResponse } from '../http-error-response';
import { UsersService } from '../users/users.service';
import { Article } from './article.entity';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly usersService: UsersService,
    private readonly articlesService: ArticlesService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get articles',
    tags: ['articles'],
  })
  @ApiHeader({
    name: 'authentication-header',
    required: false,
    schema: {
      format: 'uuid',
    },
  })
  findAll(@Headers('authentication-header') token?: string): Article[] {
    let articles: Article[] = this.articlesService.findAllPublic();

    if (token) {
      const user = this.usersService.findOneByToken(token);
      if (user) {
        articles = articles.concat(this.articlesService.findAllLoggedIn());
        articles = articles.concat(this.articlesService.findAllByAuthor(user));
      }
    }

    return [...new Set(articles)].sort((articleA, ArticleB) => {
      return articleA.articleId.localeCompare(ArticleB.articleId);
    });
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Create an Article',
    tags: ['articles'],
  })
  @ApiResponse({
    status: 201,
    description: 'Article created',
  })
  @ApiBadRequestResponse({
    description: 'Invalid visibility parameter',
    schema: HttpErrorResponse,
  })
  create(@Req() req, @Body() createArticleDto: CreateArticleDto): void {
    //* HTTP 201, if the article has been created. The response body can be empty.
    this.articlesService.create(createArticleDto, req.user);
  }
}
