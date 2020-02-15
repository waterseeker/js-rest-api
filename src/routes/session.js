module.exports = (function() {
    'use strict';

    const sessionRoutes = require('express').Router();

    sessionRoutes.get('/', (req, res) => {
        return res.send(req.context.db.users[req.context.me.id]); // should authentication go on here?
    });

    return sessionRoutes;
})();