
module.exports = function(err, req, res, next){
  // Log th eexception
  res.status(500).send('Something failed.');
}