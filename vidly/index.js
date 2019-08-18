const mongoose = require('mongoose');
const express = require('express');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const app = express();

app.use(express.json());

app.use('/api/genres', genres);
app.use('/api/customers', customers);

mongoose.connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to MongoDb...'))
  .catch((err) => console.log('Could not connect to MongoDb', err));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));