import uuidv4 from 'uuid/v4';
import Article from '../models/Article';
import db from '../models/db.js';

const articleRouter = require('express').Router();

articleRouter.get('/', (req, res) => {
  // if user has a valid token, return 200 and all articles with 'public', 'logged_in', and 'private' where this user is the author
  const headerToken = req.session['authenticationHeader'];
  const authenticatedUser = db.users.find(u => u.tokens.includes(headerToken));
  if (authenticatedUser) {
    const filteredArticles = db.articles.filter(
      article =>
        article.visibility === 'public' ||
        article.visibility === 'logged_in' ||
        (article.visibility === 'private' &&
          article.user === req.session.user.user_id)
    );
    return res.status(200).send(Object.values(filteredArticles));
  }
  // if user has no token or if the token is invalid, only return 200 and public
  else {
    const filteredArticles = db.articles.filter(
      article => article.visibility === 'public'
    );
    return res.status(200).send(Object.values(filteredArticles));
  }
});

//Only a user with a valid session can create articles.
articleRouter.post('/', (req, res) => {
  const headerToken = req.session['authenticationHeader'];
  const authenticatedUser = db.users.find(u => u.tokens.includes(headerToken));
  //* HTTP 400, if the body is empty
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send();
  }
  //* HTTP 401, if the provided token is invalid
  if (!authenticatedUser) {
    res.status(401).send();
  }
  //* HTTP 201, if the article has been created. The response body can be empty.
  if (authenticatedUser) {
    const article_id = uuidv4();
    const user_id = req.session.user.login;
    const article = new Article(
      req.body.content,
      req.body.visibility,
      user_id,
      req.body.title,
      article_id
    );
    db.articles.push(article);
    return res.status(201).send();
  }
});

export default articleRouter;
