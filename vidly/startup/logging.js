const winston = require('winston');
require('express-async-errors');
require('winston-mongodb');

module.exports = function() {

  // // This is how winston.handleExceptions() works internally
  // process.on('uncaughtException', (ex) => {
  //   winston.error(ex.message, ex);
  //   process.exit(1);
  // });

  //// Doesn't work for winston-mongodb@5.0.0
  winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true}),
    new winston.transports.File({ filename: 'uncaughtExceptions.log'})
  );

  process.on('unhandledPromiseRejection', (ex) => {
    throw ex;
  });

  winston.add(winston.transports.File, { filename: 'logfile.log'});
  winston.add(winston.transports.MongoDB,{ 
    db: 'mongodb://localhost/vidly',
    level: 'info',
  });
}