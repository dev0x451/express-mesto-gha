const Card = require('../models/card');
const {
  GENERAL_ERROR,
  GENERAL_ERROR_MESSAGE,
  RESOURCE_NOT_FOUND,
  BAD_REQUEST,
  BAD_REQUEST_MESSAGE,
  CARD_NOT_FOUND_MESSAGE,
  OK_CREATED,
} = require('../util/constants');

function getCards(req, res) {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(() => res.status(GENERAL_ERROR).send({ message: GENERAL_ERROR_MESSAGE }));
}

function createCard(req, res) {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      Card.findById(card._id)
        .populate(['owner', 'likes']).then((crd) => {
          res.status(OK_CREATED).send({ data: crd });
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') res.status(BAD_REQUEST).send({ message: BAD_REQUEST_MESSAGE });
      else res.status(GENERAL_ERROR).send({ message: err.message });
    });
}

function deleteCard(req, res) {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      const error = new Error();
      error.name = 'ResourceNotFound';
      error.message = CARD_NOT_FOUND_MESSAGE;
      error.statusCode = RESOURCE_NOT_FOUND;
      throw error;
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') res.status(BAD_REQUEST).send({ message: BAD_REQUEST_MESSAGE });
      else if (err.statusCode === RESOURCE_NOT_FOUND) {
        res.status(RESOURCE_NOT_FOUND)
          .send({ message: err.message });
      } else res.status(GENERAL_ERROR).send({ message: GENERAL_ERROR_MESSAGE });
    });
}

function setLike(req, res) {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .orFail(() => {
      const error = new Error();
      error.name = 'ResourceNotFound';
      error.message = CARD_NOT_FOUND_MESSAGE;
      error.statusCode = RESOURCE_NOT_FOUND;
      throw error;
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') res.status(BAD_REQUEST).send({ message: BAD_REQUEST_MESSAGE });
      else if (err.statusCode === RESOURCE_NOT_FOUND) {
        res.status(RESOURCE_NOT_FOUND).send({ message: err.message });
      } else res.status(GENERAL_ERROR).send({ message: GENERAL_ERROR_MESSAGE });
    });
}

function removeLike(req, res) {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .orFail(() => {
      const error = new Error();
      error.name = 'ResourceNotFound';
      error.message = CARD_NOT_FOUND_MESSAGE;
      error.statusCode = RESOURCE_NOT_FOUND;
      throw error;
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') res.status(BAD_REQUEST).send({ message: BAD_REQUEST_MESSAGE });
      else if (err.statusCode === RESOURCE_NOT_FOUND) {
        res.status(RESOURCE_NOT_FOUND).send({ message: err.message });
      } else res.status(GENERAL_ERROR).send({ message: GENERAL_ERROR_MESSAGE });
    });
}

module.exports = {
  getCards, createCard, deleteCard, setLike, removeLike,
};
