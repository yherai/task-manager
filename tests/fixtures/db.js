const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Task = require('../../src/models/task');
const User = require('../../src/models/user');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: 'User 01',
  email: 'user01@em.com',
  password: 'PrivatePass',
  tokens: [{ token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET) }],
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: 'User 02',
  email: 'user02@em.com',
  password: 'PrivatePass2',
  tokens: [{ token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET) }],
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: 'First Task',
  completed: false,
  owner: userOneId,
};
const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Second Task',
  completed: true,
  owner: userOneId,
};
const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Third Task',
  completed: true,
  owner: userTwoId,
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

module.exports = {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase,
};
