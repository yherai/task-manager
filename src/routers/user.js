const express = require('express');
const User = require('../models/user');

const router = new express.Router();

router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();

    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});

    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch('/users/:id', async (req, res) => {
  const { params = {}, body } = req;
  const { id } = params;
  const updates = Object.keys(body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid update' });
  }

  try {
    const user = await User.findById(id);

    updates.forEach((update) => {
      user[update] = body[update];
    });

    await user.save();

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      res.status(404).send();
    }

    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
