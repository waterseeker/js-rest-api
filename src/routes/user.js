import User from '../models/User';
import uuidv4 from 'uuid/v4';

const userRouter = require('express').Router();

userRouter.post('/', (req, res) => {
    //generate a user_id
    const user_id = uuidv4();
    // create a new user
    const user = new User(user_id, req.body.login, req.body.password);
    req.app.locals.db.users.push(user);
    req.session.user = user;
    return res.status(201).send();
});

export default userRouter;
