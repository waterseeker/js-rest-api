import uuidv4 from 'uuid/v4';
import 'dotenv/config';
import cors from 'cors';
import models from './models';
import routes from './routes';
import express from 'express';
console.log('Hello World! From nodemon.');
console.log(process.env.MY_SECRET);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/session', routes.session);
app.use('/users', routes.user);
app.use('/messages', routes.message);

//example of middleware
//this will expose the user in every route
app.use((req, res, next) => {
    req.context = {
        models,
        me: models.users[1],
    };
    next();
});

app.listen(3000, () =>
    console.log(`App is listening on ${process.env.PORT}.`),
);
//root url
app.get('/', (req, res) => {   
    res.send('Received a GET HTTP method.')
});

app.post('/', (req, res) => {
    res.send('Received a POST HTTP method.')
});

app.put('/', (req, res) => {
    res.send('Received a PUT HTTP method.')
});

app.delete('/', (req, res) => {
    res.send('Received a DELETE HTTP method.')
});