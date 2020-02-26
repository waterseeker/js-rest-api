import uuidv4 from 'uuid/v4';
import { Article } from '..';
import session from 'express-session';

module.exports = (function() {
    'use strict';

    const articleRoutes = require('express').Router();

    articleRoutes.get('/api/articles', (req, res) => {
        // if user has a valid token, return 200 and all articles with 'public', 'logged_in', and 'private' where this user is the author
        const filteredArticles = db.articles.filter(article => article.visibility === 'public' && 
                                            article.visibility === 'logged_in' && 
                                            (article.visibility === 'private' && article.user === req.body.user));
        return res.send(200, Object.values(filteredArticles));
        // if user has no token, only return 200 and public
        return res.send(Object.values(db.articles));
    });
    
    //Only a user with a valid session can create articles.
    articleRoutes.post('/api/articles', (req, res) => {
        //* Response:
        //* HTTP 400, if the body is empty
        if (Object.keys(req.body).length === 0) {
            return res.status(400).send();
        }
        //* HTTP 401, if the provided token is invalid
        //if there is no token in the session, or for each entry on the user tokens array, check to see if it is in the session tokens. if not, the token is invalid
        if (TRUE) {
            res.status(401).send();
        }
        //* HTTP 201, if the article has been created. The response body can be empty.
        //user has a token in session that matches one in the user token array
        if (TRUE) { 
            const article_id = uuidv4();
            const article = new Article(req.body.content, req.body.visibility, req.body.user, req.body.title, article_id);
            db.push(article);
            console.table(db.articles);
            return res.status(201).send();
        }
    });
    return articleRoutes;
})();