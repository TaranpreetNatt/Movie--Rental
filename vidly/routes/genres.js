const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { Genre, validate} = require('../models/genre');

router.get('/', async (req, res) => {
  const genres = await Genre
    .find()
    .sort('name');
  res.send(genres);
});

router.get('/:id', async (req, res) => {
  const genre = await Genre.findById(req.params.id)
    .catch( (err) => {
      res.status(404).send('The genre with the given ID was not found.');
      // console.log(err.message);
    });
  res.send(genre);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true})
    .catch((err) => {
      res.status(404).send('Could not update genre.');
      // console.log('Error', err.message);
    });
  res.send(genre);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const genre = new Genre({ name: req.body.name });
  const result = await genre.save()
    .catch((err) => {
      res.status(500).send('Could not save genre');
      // console.log('Error', err.message);
    });

  res.send(result);
});

router.delete('/:id', async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id)
    .catch((err) => {
      res.status(404).send("The genre with the given ID does not exist");
      // console.log('Error', err.message);
    });
  res.send(genre);
});

module.exports = router;