import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import apiRouter from './routes';

const app = express();
const PORT = process.env.PORT;

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
        origin: `http://localhost:${PORT}`
    })
);
app.use('/api', apiRouter);

// access the session object off of the req like so
// req.session.authentication-header

export const server = app.listen(PORT, () =>
    console.log(`App is listening at http://localhost:${PORT}/`)
);
