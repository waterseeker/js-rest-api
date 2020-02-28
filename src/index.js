import 'dotenv/config';
import cors from 'cors';
import express from 'express';

const app = express();
// const cors = require('cors');
app.use(cors({credentials: true, origin: `http://localhost:${process.env.PORT}`}));
const articleRoutes = require('./routes/articles');
const userRoutes = require('./routes/user');
const authenticateRoutes = require('./routes/authenticate');
const logoutRoutes = require('./routes/logout');
const session = require('express-session');

app.use(session({
  secret: 'would be stored in a .env file IRL',
  resave: false,
  saveUninitialized: true,
}));
app.use('/', articleRoutes);
app.use('/', userRoutes);
app.use('/', authenticateRoutes);
app.use('/', logoutRoutes);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// access the session object off of the req like so
// req.session.authentication-header

export class User {
    constructor(user_id, login, password) {
      this.user_id = user_id;
      this.login = login;
      this.password = password;
      this.tokens = [];
    }
  };

export class Article {
  constructor (content, visibility, login, title, article_id){
    this.content = content;
    this.author = login;
    this.visibility = visibility; // 'public' 'private' 'logged_in'
    // visibility settings:
    // public - the article is available to everyone
    // private - the article is only accessible to the author
    // logged_in - the article is only accessible to users with a valid session
    this.title = title;
    this.article_id = article_id;
  }
};

app.listen(process.env.PORT, () =>
    console.log(`App is listening at http://localhost:${process.env.PORT}/`),
);