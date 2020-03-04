import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import apiRouter from './routes';
import db from './db'

const app = express();

app.locals.db = db;

app.use(
    session({
        secret: 'would be stored in a .env file IRL',
        resave: false,
        saveUninitialized: true
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        credentials: true,
        origin: `http://localhost:${process.env.PORT}`
    })
);
app.use('/api', apiRouter);

// access the session object off of the req like so
// req.session.authentication-header

export default app;
