const Card = require('../models/card');

function getCards(req, res) {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

function createCard(req, res) {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      else res.status(500).send({ message: 'Произошла ошибка' });
    });
}

function deleteCard(req, res) {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      const error = new Error();
      error.name = `Карточка с ID ${req.params.cardId} не найдена`;
      error.statusCode = 404;
      throw error;
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') res.status(400).send({ message: 'Переданы некорректные данные при удалении карточки' });
      else if (err.statusCode === 404) res.status(404).send({ message: err.name });
      else res.status(500).send({ message: 'Произошла ошибка' });
    });
}

function setLike(req, res) {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      const error = new Error();
      error.name = 'Нет карточки по заданному id';
      error.statusCode = 404;
      throw error;
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') res.status(400).send({ message: 'Переданы некорректные данные при постановке лайка' });
      else if (err.statusCode === 404) res.status(404).send({ message: err.name });
      else res.status(500).send({ message: 'Произошла ошибка' });
    });
}

function removeLike(req, res) {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      const error = new Error();
      error.name = 'Нет карточки по заданному id';
      error.statusCode = 404;
      throw error;
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') res.status(400).send({ message: 'Переданы некорректные данные при снятии лайка' });
      else if (err.statusCode === 404) res.status(404).send({ message: err.name });
      else res.status(500).send({ message: 'Произошла ошибка' });
    });
}

module.exports = {
  getCards, createCard, deleteCard, setLike, removeLike,
};
