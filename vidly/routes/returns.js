const mongoose = require('mongoose');
const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const { Rental, validateRental } = require('../models/rental');

router.post('/', auth, async (req, res) => {
  if(!req.body.customerId) return res.status(400).send('customerId was not provided');
  if(!req.body.movieId) return res.status(400).send('movieId was not provided');
  
  let rental = await Rental.findOne({
    'customer._id': req.body.customerId,
    'movie._id': req.body.movieId,
  });
  if(!rental) return res.status(404).send('Rental not found.');

  if(rental.dateReturned) return res.status(400).send('Rental already processed.');
  
  rental.dateReturned = new Date();
  await rental.save();
  
  return res.status(200).send();
});








module.exports = router;