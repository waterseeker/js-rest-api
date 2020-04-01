import { Injectable } from '@nestjs/common';
import { Article, ArticleVisibility } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { User } from '../users/user.entity';

@Injectable()
export class ArticlesService {
  private readonly articles: Article[] = [
    new Article(
      'articleid1',
      'testArticle1',
      'here is some content 1',
      ArticleVisibility.public,
      '42',
    ),
    new Article(
      'articleid2',
      'testArticle2',
      'here is some content 2',
      ArticleVisibility.private,
      '42',
    ),
    new Article(
      'articleid3',
      'testArticle3',
      'here is some content 3',
      ArticleVisibility.logged_in,
      '42',
    ),
    new Article(
      'articleid4',
      'testArticle4',
      'here is some content 4',
      ArticleVisibility.private,
      '43',
    ),
    new Article(
      'articleid5',
      'testArticle5',
      'here is some content 5',
      ArticleVisibility.logged_in,
      '42',
    ),
    new Article(
      'articleid6',
      'testArticle6',
      'here is some content 6',
      ArticleVisibility.public,
      '42',
    ),
  ];

  create(createArticleDto: CreateArticleDto, user: User) {
    const article = new Article(
      createArticleDto.articleId,
      createArticleDto.title,
      createArticleDto.content,
      createArticleDto.visibility,
      user.userId,
    );

    this.articles.push(article);
  }

  findAllPublic(): Article[] {
    return (
      this.articles.filter(article => article.visibility === 'public') || []
    );
  }

  findAllLoggedIn(): Article[] {
    return (
      this.articles.filter(article => article.visibility === 'logged_in') || []
    );
  }

  findAllByAuthor(user: User): Article[] {
    return (
      this.articles.filter(article => article.author === user.userId) || []
    );
  }
}
