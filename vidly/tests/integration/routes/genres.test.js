const request = require('supertest');
const { Genre } = require('../../../models/genre');
const { User } = require('../../../models/user');

const mongoose = require('mongoose');

let server;

describe('/api/genres', () => {
  beforeEach(() => { server = require('../../../index'); });
  afterEach(async () => { 
    await server.close(); 
    await Genre.remove({});
  });

  describe('GET /', () => {
    it('should return all genres', async () => {
      await Genre.collection.insertMany([
        { name: 'genre1'},
        { name: 'genre2'},
      ]);

      const res = await request(server).get('/api/genres');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    it('should return the genre with the given valid id', async () => {
      const genre = new Genre({ name: 'genre1' });
      await genre.save();

      const res = await request(server).get(`/api/genres/${genre._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name',genre.name);
    });

    it('should return a 404 status code if invalid id is passed', async () => {
      const res = await request(server).get(`/api/genres/1`);
      expect(res.status).toBe(404);
    });

    it('should return a 404 status code if no genre with the given id exists', async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get(`/api/genres/${id}`);
      expect(res.status).toBe(404);
    });
  })

  describe('POST /', () => {

    // Define the happy path, and then in each test, we change
    // one parameter that clearly aligns with the name of the test

    let token;
    let name;

    const exec = async () => {
      return await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name });
    }

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = 'genre1';
    });


    it('should return 401 if client is not logged in', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if genre is less than 5 characters', async () => {
      name = '1234';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if genre is more than 50 characters', async () => {
      name = new Array(52).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should save the genre if it valid', async () => {
      await exec();

      const genre = await Genre.find({ name: 'genre1'});
      expect(genre).not.toBeNull();
    });

    it('should return the genre if it is valid', async () => {
      const res = await exec();
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'genre1');
    });
  });

  describe('PUT /:id', () => {

    let token;
    let _id;
    let newName;
    let genre;

    const exec = async () => {
      return await request(server)
        .put('/api/genres/' + _id)
        .set('x-auth-token', token)
        .send({ name: newName });
    }

    beforeEach(async () => {
      genre = new Genre({ name: 'genre1'});
      await genre.save();

      token = new User().generateAuthToken();
      _id = genre._id;
      newName = 'updatedName';
    });

    it('should return a 401 status code if the user is not logged in', async () => {
      token = '';
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it('should return a 400 status code if the genre is less than 5', async () => {
      newName = '1234';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return a 400 status code if the genre is more than 50', async () => {
      newName = new Array(52).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });
  
    it('should return a 404 status code if the genre could not be found.', async () => {
      _id = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it('should return a 404 status code if id is invalid', async () => {
      _id = 1;
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it('should update the genre with the given id', async () => {
      await exec();
      const updatedGenre = await Genre.findById(genre._id);
      expect(updatedGenre.name).toBe(newName);
    });

    it('should return the updated genre', async () => {
      const res = await exec();
      expect(res.body).toHaveProperty('name', newName);
      expect(res.body).toHaveProperty('_id');
    });
  });

  describe('DELETE /:id', () => {
    
    let _id;
    let token;
    let genre;

    const exec = async () => {
      return await request(server)
        .delete('/api/genres/' + _id)
        .set('x-auth-token', token)
        .send();
    }

    beforeEach(async () => {
      genre = new Genre({ name: 'genre1' });
      await genre.save();

      _id = genre._id;
      token = new User({ isAdmin: true }).generateAuthToken();
    });

    it('should return a 401 error if user is not logged in', async () => {
      token = '';
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it('should return a 404 error if id is invalid', async () => {
      _id = 1;
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it('should return a 404 error if the genre cannot be found', async () => {
      _id = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it('should return a 403 error if user is not an admin and is logged in', async () => {
      token = new User({ isAdmin: false }).generateAuthToken();
      const res = await exec();
      expect(res.status).toBe(403);
    });

    it('should delete the genre if id is valid', async () => {
      await exec();
      const genreInDb = await Genre.findById(_id);
      expect(genreInDb).toBeNull();
    });

    it('should return the removed genre', async () => {
      const res = await exec();
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'genre1');
    });
  });
});