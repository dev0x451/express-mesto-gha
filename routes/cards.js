const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, setLike, removeLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/http(s)?:\/\/(www.)?[a-z0-9\.\-]+\/[a-z0-9\.\-_~:\/?#\[\]@!$&'()*+,;=]+/),
  }),
}), createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', setLike);
router.delete('/:cardId/likes', removeLike);
module.exports = router;
