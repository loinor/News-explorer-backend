const router = require('express').Router();
const article = require('./articleRoute');
const usersRoute = require('./userRoute');

const findPage = (req, res) => {
  res.send({ message: 'Страница API' });
};

const errorPage = (req, res) => {
  res.send({ message: 'Страница не найдена' });
};

router.get('/', findPage);

module.exports = {
  router, article, usersRoute, errorPage,
};
