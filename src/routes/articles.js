import uuidv4 from 'uuid/v4';

module.exports = (function() {
    'use strict';

    const articleRoutes = require('express').Router();

    articleRoutes.get('/api/articles', (req, res) => {
        // if user has a valid token, return 200 and all articles with 'public', 'logged_in', and ('private' where this user is the author)
        // if user has no token, only return 200 and public
        return res.send(Object.values(req.context.db.articles));
    });
    
    articleRoutes.post('/api/articles', (req, res) => {
        const id = uuidv4();
        const article = {
            article_id: req.body.article_id,
            title: req.body.title,
            content: req.body.content,
            visibility: req.body.visibility,
            user_id: req.body.user_id
        };
    
        req.context.db.articles[id] = article;
    
        return res.send(article);
    });

    return articleRoutes;
})();

