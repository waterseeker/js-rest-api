const logoutRouter = require('express').Router();

logoutRouter.post('/', (req, res) => {
  // 401 if the token is invalid or if there is no user with that token
  if (!res.locals.token || !res.locals.activeUserId) {
    res.status(401).send();
  }

  // remove token from db
  delete req.app.locals.db.activeTokens[res.locals.token];

  // send 200
  res.status(200).send();
});

export default logoutRouter;
