import 'dotenv/config';
import cors from 'cors';
import db from './models/db';
import express from 'express';



const app = express();
const articleRoutes = require('./routes/articles');
const userRoutes = require('./routes/user');
const sessionRoutes = require('./routes/session');
const authenticateRoutes = require('./routes/authenticate');
const logoutRoutes = require('./routes/logout');

app.use('/', articleRoutes);
app.use('/', userRoutes);
app.use('/', sessionRoutes);
app.use('/', authenticateRoutes);
app.use('/', logoutRoutes);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export class User {
    constructor(user_id, login, password) {
      this.user_id = user_id;
      this.login = login;
      this.password = password;
      this.tokens = [];
    }
  };

//example of middleware
//this will expose the user in every route as 'me' through context
app.use((req, res, next) => {
    req.context = {
        db,
        me: db.users[1], // instead of being hard-coded, this should be the authenticated user. 
    };
    next();
});

app.listen(3000, () =>
    console.log(`App is listening on ${process.env.PORT}.`),
);