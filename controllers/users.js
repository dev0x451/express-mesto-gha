const User = require('../models/user');
const {
  GENERAL_ERROR,
  GENERAL_ERROR_MESSAGE,
  RESOURCE_NOT_FOUND,
  OK_CREATED,
  BAD_REQUEST,
  BAD_REQUEST_MESSAGE,
  USER_NOT_FOUND_MESSAGE,
} = require('../util/constants');

function getUsers(req, res) {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(GENERAL_ERROR).send({ message: GENERAL_ERROR_MESSAGE }));
}

function getUserById(req, res) {
  const { userId } = req.params;
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

function postUser(req, res) {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })

    .then((user) => res.status(OK_CREATED).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: BAD_REQUEST_MESSAGE });
      } else res.status(GENERAL_ERROR).send({ message: GENERAL_ERROR_MESSAGE });
    });
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
  postUser, getUsers, getUserById, updateUser, updateAvatar,
};
