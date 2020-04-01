/* eslint-disable @typescript-eslint/camelcase */
import { MinLength, IsIn } from 'class-validator';

export enum ArticleVisibility {
  public = 'public',
  private = 'private',
  logged_in = 'logged_in',
}
export class Article {
  constructor(
    articleId: string,
    title: string,
    content: string,
    visibility: ArticleVisibility,
    authorId: string,
  ) {
    this.articleId = articleId;
    this.content = content;
    this.title = title;
    this.visibility = visibility;
    this.author = authorId;
  }

  @MinLength(1)
  articleId: string;

  @MinLength(1)
  title: string;

  @MinLength(1)
  content: string;

  @MinLength(1)
  author: string;

  @IsIn(['public', 'private', 'logged_in'])
  visibility: ArticleVisibility;
}
