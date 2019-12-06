const usersRoute = require('express').Router();
const { getUsers } = require('../controllers/userControler');

usersRoute.get('/me', getUsers);

module.exports = usersRoute;
