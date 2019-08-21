const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { Genre } = require('../models/genre');
const { Movie, validateMovie} = require('../models/movie');


router.post('/', auth, async (req, res) => {
  const { error } = validateMovie(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(404).send('Invalid genress');

  const movie = new Movie({
    title: req.body.title,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    genre: {
      _id: genre._id,
      name: genre.name
    }
  });

  const result = await movie.save()
    .catch((err) => {
      res.status(500).send('Could not save movie');
      console.log(err.message);
    });
  res.send(result);
});

router.get('/', async (req, res) => {
  const movies = await Movie.find().sort('name')
    .catch((err) => {
      res.status(500).send('Movies could not be retried');
      console.log('Error', err.message);
    });
  res.send(movies);
});

router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id)
    .catch((err) => {
      res.status(404).send('Invalid ID');
      console.log('Error', err.message);
    });
  res.send(movie);
});

router.put('/:id', auth, async (req, res) => {
  const { error } = validateMovie(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId)
    .catch((err) => {
      res.status(404).send('Invalid genre ID');
      console.log('Error', err.message);
    });

  const movie = await Movie.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    genre: {
      _id: genre._id,
      name: genre.name
    }
  }, { new: true })
    .catch((err) => {
      res.status(500).send('Could not update movie');
      console.log(err);
    });
  res.send(movie);
});

router.delete('/:id', auth, async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id)
    .catch((err) => {
      res.status(500).send('Could not delete movie');
      console.log('Error', err.message);
    });
  res.send(movie);
});


module.exports = router;