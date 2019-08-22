
module.exports = function asyncMiddleware(handler) {
  return async (req, res, next) => {
    try {
      await hander(req, res);
    }
    catch(ex) {
      next(ex);
    }
  }
}