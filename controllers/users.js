const User = require('../models/user');

function getUsers(req, res) {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка поиска' }));
}

function getUserById(req, res) {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка поиска по ID ' }));
}

function postUser(req, res) {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })

    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка создания пользователя' }));
}

function updateUser(req, res) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка обновления пользователя' }));
}

function updateAvatar(req, res) {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка обновления аватара' }));
}

module.exports = {
  postUser, getUsers, getUserById, updateUser, updateAvatar,
};
