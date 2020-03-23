/**
 * Parses token from request header and finds matching authenticated user in Db if available.
 * Saves in res.locals for use in future middlewares.
 *
 * @param {Object} req - Express req object
 * @param {Object} res - Express res object
 * @param {Function} next - Express next function
 *
 * @modifies {res.locals.token} - User token parsed from the request header
 * @modifies {res.locals.activeUserId} - User ID matching the token if available
 */
function authenticateUser (req, res, next) {
  res.locals.token = req.get('authentication-header')
  res.locals.activeUserId = res.locals.token ? req.app.locals.db.activeTokens[res.locals.token] : null
  next()
}

export default authenticateUser
