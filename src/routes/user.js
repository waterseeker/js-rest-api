import db from '../models/db.js';
import { User } from '../index';
import uuidv4 from 'uuid/v4';

module.exports = (function() {
    'use strict';
    
    const userRoutes = require('express').Router();
    const bodyParser = require('body-parser').json();

    userRoutes.post('/api/user', bodyParser, (req, res) => {
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
    return userRoutes;
})();