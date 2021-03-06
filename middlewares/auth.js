const jwt = require('jsonwebtoken');
const AuthErr = require('../errors/authErr');
const secretKey = require('../Configuration/secret-dev-key');

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const { NODE_ENV, JWT_SECRET } = process.env;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthErr('Необходима авторизация');
  }
  const token = extractBearerToken(authorization);
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : secretKey.DEV_KEY);
  } catch (err) {
    throw new AuthErr('Необходима авторизация');
  }
  req.user = payload;
  return next();
};
