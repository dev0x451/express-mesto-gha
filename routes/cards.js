const router = require('express').Router();
const { getCards, createCard, deleteCard } = require('../controllers/cards');

const Card = require('../models/card');

router.get('/cards', getCards);
router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCard);
module.exports = router;
