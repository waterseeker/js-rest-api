import { v4 as uuidv4 } from 'uuid'

const authenticateRouter = require('express').Router()

authenticateRouter.post('/', (req, res) => {
  // 404 if there's no such user in the db
  const loginMatch = req.app.locals.db.users.find(u => u.login === req.body.login)
  if (!loginMatch) {
    return res.status(404).send()
  }

  // 401 if user exists in the db but the password given doesn't match what's in the db
  if (loginMatch.password !== req.body.password) {
    return res.status(401).send()
  }

  // 200 if login and password match the user in the db. Send a token in the res.body.
  const token = uuidv4()

  req.app.locals.db.activeTokens[token] = loginMatch.userId

  return res.status(200).send({
    token: token
  })
})

export default authenticateRouter
