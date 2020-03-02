import db from '../models/db.js';
import uuidv4 from 'uuid/v4';

const authenticateRouter = require('express').Router();

authenticateRouter.post('/', (req, res) => {
    //404 if there's no such user in the db
    const login_match = db.users.find(u => u.login === req.body.login);
    if (!login_match) {
        return res.status(404).send();
    }
    //401 if user exists in the db but the password given doesn't match what's in the db
    const authenticatedUser = db.users.find(
        u => u.login === req.body.login && u.password === req.body.password
    );
    if (!authenticatedUser) {
        return res.status(401).send();
    }
    // 200 if login and password match the user in the db. Send a token in the res.body.
    if (authenticatedUser) {
        const token = uuidv4();
        authenticatedUser.tokens.push(token);

        if (req.session.authenticationHeader) {
            req.session.authenticationHeader =
                req.session.authenticationHeader + ' ' + token;
        } else {
            req.session.authenticationHeader = token;
        }

        res.set('authentication-header', token);
        return res.status(200).send({
            token: token
        });
    }
});

export default authenticateRouter;
