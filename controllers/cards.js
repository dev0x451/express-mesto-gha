const Card = require('../models/card');
const {
  BAD_REQUEST_MESSAGE,
  CARD_NOT_FOUND_MESSAGE,
  STATUS_OK_CREATED,
  CARD_DELETION_NOT_AUTHORIZED_MESSAGE,
  STATUS_OK,
} = require('../util/constants');
const { NotFoundError, BadRequestError, ForbiddenError } = require('../errors/errors');

function getCards(req, res, next) {
  Card.find({}).sort({ createdAt: -1 })
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(next);
}

function createCard(req, res, next) {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      Card.findById(card._id)
        .populate(['owner', 'likes']).then((crd) => {
          res.status(STATUS_OK_CREATED).send(crd);
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') next(new BadRequestError(BAD_REQUEST_MESSAGE));
      else next(err);
    });
}

function deleteCard(req, res, next) {
  const { cardId } = req.params;

  Card.findOne({ _id: cardId })
    .orFail(() => {
      throw new NotFoundError(CARD_NOT_FOUND_MESSAGE);
    })
    .then((card) => {
      if (req.user._id === card.owner._id.toString()) {
        Card.findByIdAndRemove(cardId)
          .then((card2) => res.status(STATUS_OK).send(card2))
          .catch((err) => {
            if (err.name === 'CastError') next(new BadRequestError(BAD_REQUEST_MESSAGE));
            else next(err);
          });
      } else next(new ForbiddenError(CARD_DELETION_NOT_AUTHORIZED_MESSAGE));
    })
    .catch(next);
}

function setLike(req, res, next) {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .orFail(() => {
      throw new NotFoundError(CARD_NOT_FOUND_MESSAGE);
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') next(new BadRequestError(BAD_REQUEST_MESSAGE));
      else next(err);
    });
}

function removeLike(req, res, next) {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .orFail(() => {
      throw new NotFoundError(CARD_NOT_FOUND_MESSAGE);
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') next(new BadRequestError(BAD_REQUEST_MESSAGE));
      else next(err);
    });
}

module.exports = {
  getCards, createCard, deleteCard, setLike, removeLike,
};
