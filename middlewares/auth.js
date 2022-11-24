/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../util/constants');
const { NotAuthorizedError } = require('../errors/errors');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new NotAuthorizedError('Необходима авторизация');
  }

  let payload;
  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    next(err);
  }
  req.user = payload;
  next();
};
