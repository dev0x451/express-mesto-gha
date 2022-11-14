const User = require('../models/user');

function getUsers(req, res) {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

function getUserById(req, res) {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      const error = new Error();
      error.name = `Пользователь по ID ${userId} не найден.`;
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') res.status(400).send({ message: 'Переданы некорректные данные при поиске пользователя' });
      else if (err.statusCode === 404) res.status(404).send({ message: err.name });
      else res.status(500).send({ message: 'Произошла ошибка' });
    });
}

function postUser(req, res) {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })

    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Ошибка валидации при создании пользователя' });
      } else res.status(500).send({ message: 'Произошла ошибка' });
    });
}

function updateUser(req, res) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  }).orFail(() => {
    const error = new Error();
    error.name = `Пользователь по ID ${req.user._id} не найден`;
    error.statusCode = 404;
    throw error;
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      else if (err.statusCode === 404) res.status(404).send({ message: err.name });
      else res.status(500).send({ message: 'Произошла ошибка' });
    });
}

function updateAvatar(req, res) {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

module.exports = {
  postUser, getUsers, getUserById, updateUser, updateAvatar,
};
