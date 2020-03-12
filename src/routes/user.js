import User from '../models/User';

const userRouter = require('express').Router();

userRouter.post('/', (req, res) => {
    // create a new user
    const user = new User(req.body.user_id, req.body.login, req.body.password);
    req.app.locals.db.users.push(user);

    return res.status(201).send();
});

export default userRouter;
