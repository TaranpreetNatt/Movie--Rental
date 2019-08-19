const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('./genre');

const Movie = mongoose.model('Movie', new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlengh: 1,
    maxlength: 255
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255
  },
  dailyRentalRate:{
    type: Number,
    required: true,
    min: 0,
    max: 255
  },
  genre: {
    type: genreSchema,
    required: true
  }
}));

function validateMovie(movie) {
  const schema = {
    title: Joi.string().required().min(1).max(50),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
    genreId: Joi.string().required()
  }
  return Joi.validate(movie, schema)
}

module.exports.Movie = Movie;
module.exports.validateMovie = validateMovie;