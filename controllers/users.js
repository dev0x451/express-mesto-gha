const User = require('../models/user');

function getUsers(req, res) {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка поиска' }));
}

function getUsersById(req, res) {
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

module.exports = { postUser, getUsers, getUsersById };
