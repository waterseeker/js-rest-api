import db from '../models/db.js'

module.exports = (function() {
    'use strict';
    
    const logoutRoutes = require('express').Router();
    const bodyParser = require('body-parser').json();

    logoutRoutes.post('/api/logout', bodyParser, (req, res) => {
        // 401 if the token is invalid
        if ((Object.keys(!req.headers["authentication-header"]) || // if there is no token in header
            !db.users.find(u => u.tokens.includes(req.headers.authentication-header)))) { // or if there is no user with that token
                res.status(401).send()
            }
        let headerToken = req.headers["authentication-header"];
        let authenticatedUser = db.users.find(u => u.tokens.includes(headerToken));
        if (authenticatedUser) {
            // remove token from token array
            const tokenIndex = authenticatedUser.indexOf(headerToken);
            authenticatedUser.tokens.splice(tokenIndex, 1);
            // send 200
            res.status(200).send();
        }
        console.log(headerToken);
    });
    
    return logoutRoutes;
})();