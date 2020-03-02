import db from '../models/db.js';
import User from '../models/User';
import uuidv4 from 'uuid/v4';

const userRouter = require('express').Router();

userRouter.post('/', (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).send();
    }
    //generate a user_id
    const user_id = uuidv4();
    // create a new user
    const user = new User(req.body.user_id, req.body.login, req.body.password);
    db.users.push(user);
    req.session.user = user;
    return res.status(201).send();
});

export default userRouter;
