const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { celebrate, Joi, errors } = require('celebrate');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const joiObjectId = require('joi-objectid');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

Joi.objectId = joiObjectId(Joi);

const { login, createUser } = require('./controllers/userControler');
const { router, article, usersRoute, errorPage } = require('./routes/router');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const { PORT = 3000 } = process.env;
const app = express();

app.use(limiter);
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);
app.use('/', router);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .error(new Error('Введите почту')),
    password: Joi.string().required().min(5)
      .error(new Error('Введите пароль')),
    name: Joi.string().required().min(2).max(30)
      .error(new Error('Введите имя')),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .error(new Error('Введите почту')),
    password: Joi.string().required().min(5)
      .error(new Error('Введите пароль')),
  }),
}), login);

app.use(auth);

app.use('/users', usersRoute);
app.use('/articles', article);
app.use('*', errorPage);
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

mongoose.connect('mongodb://localhost:27017/newsExplorer', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  console.log(`Сервер работает на ${PORT} порту`);
});
