require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { NotFoundError, BadRequestError, UserAlreadyExistsError } = require('../errors/errors');

const {
  STATUS_OK_CREATED,
  STATUS_OK,
  SUCCESSFUL_AUTHORIZATION_MESSAGE,
  SUCCESSFUL_LOGOUT_MESSAGE,
  ALREADY_EXISTS_MESSAGE,
  BAD_REQUEST_MESSAGE,
  USER_NOT_FOUND_MESSAGE,
  USERS_NOT_FOUND_MESSAGE,
  JWT_TOKEN_EXPIRES,
  COOKIE_MAX_AGE,
} = require('../util/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

function login(req, res, next) {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password).then((user) => {
    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: JWT_TOKEN_EXPIRES });
    res.cookie('jwt', token, {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: false,
      secure: true,
    })
      .status(STATUS_OK)
      .send({ message: SUCCESSFUL_AUTHORIZATION_MESSAGE });
  })
    .catch(next);
}

function logout(req, res, next) {
  try {
    res.clearCookie('jwt')
      .status(STATUS_OK)
      .send({ message: SUCCESSFUL_LOGOUT_MESSAGE });
  } catch (err) { next(err); }
}

function getUsers(req, res, next) {
  User.find({})
    .orFail(() => {
      throw new NotFoundError(USERS_NOT_FOUND_MESSAGE);
    })
    .then((users) => res.send(users))
    .catch(next);
}

function getUserById(req, res, next) {
  const userId = req.params.userId || req.user._id;
  User.findById(userId)
    .orFail(() => {
      throw new NotFoundError(USER_NOT_FOUND_MESSAGE);
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') next(new BadRequestError(BAD_REQUEST_MESSAGE));
      else next(err);
    });
}

function createUser(req, res, next) {
  const {
    email, password, name, about, avatar,
  } = req.body;
  if (!password) throw new BadRequestError(BAD_REQUEST_MESSAGE);
  bcrypt.hash(password, 10)
    .then(

      (hash) => {
        User.create({
          email,
          password: hash,
          name,
          about,
          avatar,
        })
          .then((user) => res.status(STATUS_OK_CREATED).send({
            _id: user._id,
            email: user.email,
            name: user.name,
            about: user.about,
            avatar: user.avatar,

          }))
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(new BadRequestError(BAD_REQUEST_MESSAGE));
            } else if (err.code === 11000) {
              next(new UserAlreadyExistsError(ALREADY_EXISTS_MESSAGE));
            } else next(err);
          });
      },
    )
    .catch(next);
}

function updateUser(req, res, next) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  }).orFail(() => {
    throw new NotFoundError(USER_NOT_FOUND_MESSAGE);
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') next(new BadRequestError(BAD_REQUEST_MESSAGE));
      else next(err);
    });
}

function updateAvatar(req, res, next) {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .orFail(() => {
      throw new NotFoundError(USER_NOT_FOUND_MESSAGE);
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') next(new BadRequestError(BAD_REQUEST_MESSAGE));
      else next(err);
    });
}

module.exports = {
  createUser, login, logout, getUsers, getUserById, updateUser, updateAvatar,
};
