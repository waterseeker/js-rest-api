export default class Article {
  constructor (content, visibility, login, title, articleId) {
    this.content = content
    this.author = login
    this.visibility = visibility // 'public' 'private' 'logged_in'
    // visibility settings:
    // public - the article is available to everyone
    // private - the article is only accessible to the author
    // logged_in - the article is only accessible to users with a valid session
    this.title = title
    this.articleId = articleId
  }
}
