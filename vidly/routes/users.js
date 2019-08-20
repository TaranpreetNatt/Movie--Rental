const bcrypt = require('bcryptjs');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const { User, validateUser } = require('../models/user')
const router = express.Router();

router.post('/', async(req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne( { email: req.body.email });
  if (user) return res.status(400).send('User already registerd.');

  // user = new User({
  //   name: req.body.name,
  //   email: req.body.email,
  //   password: req.body.password
  // });

  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  const result = await user.save()
    .catch((err) => {
      res.status(500).send('Could not register user');
      console.log('Error', err.message);
    });
  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

router.get('/', async (req, res) => {
  const users = await User.find().sort('name')
    .catch((err) => {
      res.status(500).send('Could not retrieve users');
      console.log('Error', err);
    });
  res.send(users);
});

module.exports = router;