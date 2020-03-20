import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import apiRouter from './routes';
import db from './db'
import authenticateUser from './middlewares/authenticate-user'
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger/openapi.json";

const app = express();

app.locals.db = db;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        credentials: true,
        origin: `http://localhost:${process.env.PORT}`
    })
);
app.use('/api', authenticateUser, apiRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;
