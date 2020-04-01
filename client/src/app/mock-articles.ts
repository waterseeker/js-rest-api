import { Article } from './interfaces/article';

export const ARTICLES: Article[] = [
    { content: 'here is some content 1', visibility: 'public', author: '42', title: 'testArticle1', articleId: 'articleid1' },
    { content: 'here is some content 2', visibility: 'private', author: '42', title: 'testArticle2', articleId: 'articleid2' },
    { content: 'here is some content 3', visibility: 'logged_in', author: '42', title: 'testArticle3', articleId: 'articleid3' },
    { content: 'here is some content 4', visibility: 'private', author: '43', title: 'testArticle4', articleId: 'articleid4' },
    { content: 'here is some content 5', visibility: 'logged_in', author: '42', title: 'testArticle5', articleId: 'articleid5' },
    { content: 'here is some content 6', visibility: 'public', author: '42', title: 'testArticle6', articleId: 'articleid6' }
]