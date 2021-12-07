const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');

const userOne = {
  name: 'User 01',
  email: 'user01@em.com',
  password: 'PrivatePass',
};

describe('user endpoints', () => {
  beforeEach(async () => {
    await User.deleteMany();
    await new User(userOne).save();
  });

  test('Should signup a new user', async () => {
    await request(app)
      .post('/users')
      .send({
        name: 'Jorge',
        email: 'therai@hotmail.com',
        password: 'MyPass777!',
      })
      .expect(201);
  });

  test('Should login existing user', async () => {
    await request(app)
      .post('/users/login')
      .send({
        email: userOne.email,
        password: userOne.password,
      })
      .expect(200);
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
});
