const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const {
  GENERAL_ERROR,
  GENERAL_ERROR_MESSAGE,
  RESOURCE_NOT_FOUND,
  OK_CREATED,
  BAD_REQUEST,
  BAD_REQUEST_MESSAGE,
  USER_NOT_FOUND_MESSAGE,
  SECRET_KEY,
} = require('../util/constants');

function login(req, res) {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password).then((user) => {
    const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '7d' });

    res.cookie('jwt', token, {
      maxAge: 3600000,
      httpOnly: true,
      sameSite: true,
    })
      .status(200)
      .send({ message: 'Успешная авторизация' });
  })
    .catch((err) => res.status(GENERAL_ERROR).send({ message: err.message }));
}

function getUsers(req, res) {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(GENERAL_ERROR).send({ message: GENERAL_ERROR_MESSAGE }));
}

function getUserById(req, res) {
  const userId = req.params.userId || req.user._id;
  User.findById(userId)
    .orFail(() => {
      const error = new Error();
      error.name = 'ResourceNotFound';
      error.message = USER_NOT_FOUND_MESSAGE;
      error.statusCode = RESOURCE_NOT_FOUND;
      throw error;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') res.status(BAD_REQUEST).send({ message: BAD_REQUEST_MESSAGE });
      else if (err.statusCode === RESOURCE_NOT_FOUND) {
        res.status(RESOURCE_NOT_FOUND).send({ message: err.message });
      } else res.status(GENERAL_ERROR).send({ message: GENERAL_ERROR_MESSAGE });
    });
}

function createUser(req, res) {
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
          .then((user) => res.status(OK_CREATED).send({
            _id: user._id,
            email: user.email,
            name: user.name,
            about: user.about,
            avatar: user.avatar,

          }))
          .catch((err) => {
            if (err.name === 'ValidationError') {
              res.status(BAD_REQUEST).send({ message: BAD_REQUEST_MESSAGE });
            } else if (err.code === 11000) {
              res.status(409).send({ message: 'email уже сущ' });
            } else res.status(GENERAL_ERROR).send({ message: GENERAL_ERROR_MESSAGE });
          });
      },
    )
    .catch(() => { res.status(GENERAL_ERROR).send({ message: GENERAL_ERROR_MESSAGE }); });
}

function updateUser(req, res) {
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

function updateAvatar(req, res) {
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
