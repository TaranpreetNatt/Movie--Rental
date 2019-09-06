const { Rental } = require('../../../models/rental');
const { User } = require('../../../models/user');
const { Movie } = require('../../../models/movie');
const moment = require('moment');
const mongoose = require('mongoose');
const request = require('supertest');

describe('/api/returns', () => {
  let server;
  let customerId;
  let rental;
  let token;
  let movie;

  beforeEach(async () => {
    server = require('../../../index');
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    movie = new Movie({
      title: '12345',
      _id: movieId,
      dailyRentalRate: 2,
      genre: { name: '12345' },
      numberInStock: 10,
    });

    await movie.save();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: '12345',
        phone: '12345',
      },
      movie: {
        _id: movieId,
        title: '12345',
        dailyRentalRate: 2
      },
    });
    await rental.save();
  });

  afterEach(async () => {
    await rental.remove({});
    await movie.remove({});
    await server.close();
  });

  const exec = async () => {
    return await request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ customerId, movieId});
  }

  it('should return 401 if client is not logged in', async () => {
    token = '';
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it('should return 400 if customerId is not provided', async () => {
    customerId = '';
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it('should return 400 if movieId is not provided', async () => {
    movieId = '';
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it('should return 404 if rental is not found for customer/movie', async () => {
    await Rental.remove({});
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it('should return 400 if rental is already processed', async () => {
    rental.dateReturned = new Date();
    await rental.save();

    const res  = await exec();
    expect(res.status).toBe(400);
  });

  it('should return 200 if the request is valid', async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });

  it('should set the return date if input is valid', async () => {
    const res = await exec();
    const rentalInDb = await Rental.findById(rental._id);
    const diff = new Date() - rentalInDb.dateReturned;
    expect(diff).toBeLessThan(10000); // want difference to be less than 10 seconds
  });

  it('should set the rental fee if rental is valid', async () => {
    rental.dateOut = moment().add(-7, 'days').toDate();
    await rental.save();

    const res = await exec();
    const rentalInDb = await Rental.findById(rental._id);

    expect(rentalInDb.rentalFee).toBe(14);
  });

  it('should increase the stock of the movie if rental is valid', async () => {
    const res = await exec();
    const movieInDb = await Movie.findById(movie._id);
    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
  });

  it('should return the rental in the body of the response', async () => {
    const res = await exec();
    expect(Object.keys(res.body)).toEqual(expect.arrayContaining([
      'customer', 'movie', 'dateOut', 'dateReturned', 'rentalFee'
    ]));
  });

});