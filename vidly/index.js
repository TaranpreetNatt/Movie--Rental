const mongoose = require('mongoose');
const express = require('express');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const app = express();

app.use(express.json());

app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies/', movies);

mongoose.connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to MongoDb...'))
  .catch((err) => console.log('Could not connect to MongoDb', err));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));