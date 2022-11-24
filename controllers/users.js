const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { NotFoundError, BadRequestError, UserAlreadyExistsError } = require('../errors/errors');

const {
  GENERAL_ERROR,
  GENERAL_ERROR_MESSAGE,
  RESOURCE_NOT_FOUND,
  STATUS_OK_CREATED,
  STATUS_OK,
  SUCCESSFUL_AUTHORIZATION_MESSAGE,
  BAD_REQUEST,
  STATUS_ALREADY_EXISTS_MESSAGE,
  BAD_REQUEST_MESSAGE,
  USER_NOT_FOUND_MESSAGE,
  USERS_NOT_FOUND_MESSAGE,
  SECRET_KEY,
  JWT_TOKEN_EXPIRES,
  COOKIE_MAX_AGE,
} = require('../util/constants');

function login(req, res, next) {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password).then((user) => {
    // if (!user) {
    //   throw new NotFoundError('Нет пользователя с таким id');
    // }

    const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: JWT_TOKEN_EXPIRES });

    res.cookie('jwt', token, {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: true,
    })
      .status(STATUS_OK)
      .send({ message: SUCCESSFUL_AUTHORIZATION_MESSAGE });
  })
    .catch(next);
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
              next(new UserAlreadyExistsError(STATUS_ALREADY_EXISTS_MESSAGE));
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
    const error = new Error();
    error.name = 'ResourceNotFound';
    error.message = USER_NOT_FOUND_MESSAGE;
    error.statusCode = RESOURCE_NOT_FOUND;
    throw error;
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') res.status(BAD_REQUEST).send({ message: BAD_REQUEST_MESSAGE });
      else if (err.statusCode === RESOURCE_NOT_FOUND) {
        res.status(RESOURCE_NOT_FOUND)
          .send({ message: err.message });
      } else res.status(GENERAL_ERROR).send({ message: GENERAL_ERROR_MESSAGE });
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
      const error = new Error();
      error.name = 'ResourceNotFound';
      error.message = USER_NOT_FOUND_MESSAGE;
      error.statusCode = RESOURCE_NOT_FOUND;
      throw error;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') res.status(BAD_REQUEST).send({ message: BAD_REQUEST_MESSAGE });
      else if (err.statusCode === RESOURCE_NOT_FOUND) {
        res.status(RESOURCE_NOT_FOUND)
          .send({ message: err.message });
      } else res.status(GENERAL_ERROR).send({ message: GENERAL_ERROR_MESSAGE });
    });
}

module.exports = {
  createUser, login, getUsers, getUserById, updateUser, updateAvatar,
};
