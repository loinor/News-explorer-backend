const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');
const WrongAccessData = require('../errors/wrongAccessData');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: (props) => `${props.value} неверный email`,
    },
    unique: true,
  },
  password: {
    type: String,
    select: false,
    required: true,
    minlength: 8,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new WrongAccessData('Неверный пароль или почтоый адрес');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new WrongAccessData('Неверный пароль или почтоый адрес');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
