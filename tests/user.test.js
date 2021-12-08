const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/user');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: 'User 01',
  email: 'user01@em.com',
  password: 'PrivatePass',
  tokens: [{ token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET) }],
};

describe('user endpoints', () => {
  beforeEach(async () => {
    await User.deleteMany();
    await new User(userOne).save();
  });

  test('Should signup a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'Jorge',
        email: 'yherai@hotmail.com',
        password: 'MyPass777!',
      })
      .expect(201);

    // Assert that new user was created
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // Assertions about the response
    expect(response.body).toMatchObject({
      user: {
        name: 'Jorge',
        email: 'yherai@hotmail.com',
      },
      token: user.tokens[0].token,
    });

    // Assert plain password is not saved
    expect(user.password).not.toBe('MyPass777!');
  });

  test('Should login existing user', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({
        email: userOne.email,
        password: userOne.password,
      })
      .expect(200);

    // Assert a new token is generated for the user
    const user = await User.findById(response.body.user._id);
    expect(user.tokens[1].token).toBe(response.body.token);
  });

  test('Should not login non existing user', async () => {
    await request(app)
      .post('/users/login')
      .send({
        email: userOne.email,
        password: 'invalidPassword',
      })
      .expect(400);
  });

  test('Should get profile for user', async () => {
    await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200);
  });

  test('Should not get profile for unauthenticated user', async () => {
    await request(app).get('/users/me').send().expect(401);
  });

  test('Should delete account for user', async () => {
    await request(app)
      .delete('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200);

    // Assert that user is deleted from database
    const user = await User.findById(userOne._id);
    expect(user).toBeNull();
  });

  test('Should not delete account for unauthenticated user', async () => {
    await request(app).delete('/users/me').send().expect(401);
  });
});
