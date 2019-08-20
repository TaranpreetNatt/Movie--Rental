const { Customer, validate} = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = new Customer({
    isGold: req.body.isGold,
    name: req.body.name,
    phone: req.body.phone
  });

  const result = await customer.save()
    .catch((err) => {
      res.status(500).send('Could not save to database');
      console.log("Error", err.message);
    });
  res.send(result);
});

router.get('/', async (req, res) => {
  const customers = await Customer
    .find()
    .sort('name');
  res.send(customers);
});

router.get('/:id', async (req, res) => {
  const customer = await Customer
    .findById(req.params.id)
    .catch((err) => {
      res.status(404).send('Customer with the given ID was not found');
      console.log("Error", err.message);
    });
  res.send(customer);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(req.params.id, {
    isGold: req.body.isGold,
    name: req.body.name,
    phone: req.body.phone
  }, { new: true})
    .catch((err) => {
      res.status(500).send('Could not update customer.');
      console.log('Error', err.message);
    });
  
  res.send(customer);
});

router.delete('/:id', async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id)
    .catch((err) => {
      res.status(404).send('Customer with the given ID was not deleted.');
      console.log('Error', err.message);
    });
  
  if (!customer) res.status(404).send('Customer with the given ID was not found.');

  res.send(customer);
});

module.exports = router;