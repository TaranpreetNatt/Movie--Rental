const config = require('config');
const helmet = require('helmet');
const debug = require('debug')('app:startup');
const morgan = require('morgan');
const Joi = require('joi');
const express = require('express');
const authenticator = require('./middleware/authenticator');
const logger = require('./middleware/logger');
const courses = require('./routes/courses');
const home = require('./routes/home');
const app = express();

app.set('view engine', 'pug'); //express will auto load module
app.set('views', './views'); //default setting don't have to set this unless overwriting

app.use(express.json());
app.use(express.static('public'));
app.use(helmet());
app.use('/api/courses', courses);
app.use('/', home);

// //configuration
// console.log(`Application Name: ${config.get('name')}`);
// console.log(`Mail Server: ${config.get('mail.host')}`);
// console.log(`Mail Password: ${config.get('mail.password')}`);


if(app.get('env') === 'development'){
  app.use(morgan('tiny'));
  debug('Morgan enabled');
}

app.use(logger);

app.use(authenticator);

//
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));