import db from '../models/db.js'

module.exports = (function() {
    'use strict';
    
    const logoutRoutes = require('express').Router();
    const bodyParser = require('body-parser').json();

    logoutRoutes.post('/api/logout', bodyParser, (req, res) => {
        // 401 if the token is invalid
        if (!req.session.authenticationHeader || // if there is no token in header
            !db.users.find(u => u.tokens.includes(req.session.authenticationHeader))) { // or if there is no user with that token
                res.status(401).send()
            }
        let headerToken = req.session["authenticationHeader"]; 
        let authenticatedUser = db.users.find(u => u.tokens.includes(headerToken));
        if (authenticatedUser) { console.log('Authenticated User found.');
            // remove token from token array on the user
            const tokenIndex = authenticatedUser.tokens.indexOf(headerToken);
            authenticatedUser.tokens.splice(tokenIndex, 1);
            // remove token from session
            req.session.authenticationHeader = '';
            // send 200
            res.status(200).send();
        }
        console.log(headerToken);
    });
    
    return logoutRoutes;
})();

// can i just store the tokens on the user and not use session at all?
