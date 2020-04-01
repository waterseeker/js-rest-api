import { MinLength, IsIn } from 'class-validator';
import { ArticleVisibility } from '../article.entity';

export class CreateArticleDto {
  @MinLength(1)
  articleId: string;

  @MinLength(1)
  title: string;

  @MinLength(1)
  content: string;

  @IsIn(['public', 'private', 'logged_in'])
  visibility: ArticleVisibility;
}
