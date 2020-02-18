import db from '../models/db.js'
import uuidv4 from 'uuid/v4';

module.exports = (function() {
    'use strict';
    
    const authenticationRoutes = require('express').Router();
    const bodyParser = require('body-parser').json();

    authenticationRoutes.post('/api/authenticate', bodyParser, (req, res) => {
        // 400 if body is empty
        if (Object.keys(req.body).length === 0) {
            return res.status(400).send();
        }
        //404 if no such user
        let login_match = db.users.find(u => u.login === req.body.login);
        if (!login_match) {
            return res.status(404).send();
        }
        //401 if user but wrong password
        let authenticatedUser = db.users.find(u => u.login === req.body.login && u.password === req.body.password);
        if (!authenticatedUser) {
            return res.status(401).send();
        }
        // 200 if login and password match user in the db. send a token in the res.body like ...
        if (authenticatedUser) {
            let token = uuidv4();
            authenticatedUser.tokens.push(token);
            console.log(db.users);

            // need a way to store user tokens so they can be modified and queried later for authentication

            // Attempt 1, localStorage
            // if there was a frontend to this app, you could use localStorage for storing the tokens
            // however this was a backend coding challenge so there is no frontend...
            // also, using localStorage to store sensitive info like jwt tokens, user info, etc is unsafe.fail

            // if (window.localStorage.authentication-header) {
            //     window.localStorage.authentication-header.concat(" " + token);
            // } else {
            //     window.localStorage.setItem("authentication-header", token);
            // }
            // console.log(window.localStorage.authentication-header);
            
            res.set('authentication-header', token);
            return res.status(200).send({
                "token": token,
            })
        }
    });
    
    return authenticationRoutes;
})();