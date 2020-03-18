import Article from '../models/Article';

const articleRouter = require('express').Router();

articleRouter.get('/', (req, res) => {
  let filteredArticles = [];

  // if user has a valid token, return 200 and all articles with 'public', 'logged_in', and 'private' where this user is the author
  if (res.locals.activeUserId) {
    filteredArticles = req.app.locals.db.articles.filter(
      (article) => article.visibility === 'public'
        || article.visibility === 'logged_in'
        || (article.visibility === 'private'
          && article.author === res.locals.activeUserId),
    );
  }
  // if user has no token or if the token is invalid, only return 200 and public
  else {
    filteredArticles = req.app.locals.db.articles.filter(
      (article) => article.visibility === 'public',
    );
  }

  return res.status(200).json(filteredArticles);
});

// Only a user with a valid session can create articles.
articleRouter.post('/', (req, res) => {
  const VISIBILITY_OPTIONS = ['public', 'private', 'logged_in'];

  //* HTTP 401, if the provided token is invalid
  if (!res.locals.activeUserId) {
    return res.status(401).send();
  }

  if (!VISIBILITY_OPTIONS.includes(req.body.visibility)) {
    return res.status(400).json({
      error: 'visibility must be one of "public", "private", or "logged_in"',
    });
  }

  //* HTTP 201, if the article has been created. The response body can be empty.
  const article = new Article(
    req.body.content,
    req.body.visibility,
    res.locals.activeUserId,
    req.body.title,
    req.body.articleId,
  );

  req.app.locals.db.articles.push(article);

  return res.status(201).send();
});

export default articleRouter;
