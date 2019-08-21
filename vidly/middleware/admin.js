
// this middleware function should run after auth middleware
// so we should be able to access the req.user object
module.exports = function (req, res, next) {
  // 401 Unauthorized used when user tries to access a protected resource but don't supply 
  //     a valid json web token, if they supply a valid token and still have no access we give a 403
  // 403 Forbidded means don' try again you cannot access that resource

  if(!req.user.isAdmin) return res.status(403).send('Access denied');
  next();
}