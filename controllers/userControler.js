const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AuthErr = require('../errors/authErr');
const NotFpundErr = require('../errors/notFoundErr');

const getUsers = (req, res, next) => {
  const currentUser = req.user._id;
  User.findById({ _id: currentUser })
    .then((user) => {
      if (!user) {
        throw new NotFpundErr('Такого пользователя не существует');
      } else {
        res.send({
          email: user.email,
          name: user.name,
        });
      }
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((users) => res.status(201).send({
      email: users.email,
      name: users.name,
    }))
    .catch(() => {
      next(new AuthErr('Такая почта уже используется'));
    });
};

const login = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports = { getUsers, createUser, login };
